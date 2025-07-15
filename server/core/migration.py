import logging
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from asyncpg.exceptions import InvalidCatalogNameError, DuplicateDatabaseError
from sqlalchemy.exc import ProgrammingError
from asyncpg.exceptions import InvalidCatalogNameError
from sqlalchemy import inspect
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)
from model.account import Account
from model.chat import ChatRecord, ChatConversation, SharedConversation
from util.database import create_db_engine

from app_factory import TAgenticApp
app = TAgenticApp.get_app()

class Migration:
    @staticmethod
    async def check_tables(db: AsyncSession):   
        exist_tables = []
        try:
            async with db.bind.connect() as conn:
                exist_tables = await conn.run_sync(lambda sync_conn: inspect(sync_conn).get_table_names())
                await conn.commit()
        except InvalidCatalogNameError as e:#asyncpg.exceptions.UndefinedTableError:
            logging.error(f"[check_tables] {e}")

        target_tables = [t.name for t in Migration.tables()[0].metadata.sorted_tables]
        logging.info(f"[check_tables] exist_tables={exist_tables}, target_tables={target_tables}")
        return [t for t in target_tables if t not in exist_tables]

    @staticmethod
    async def init_db(app: TAgenticApp):   
        _, sessionmaker = create_db_engine(app, override_db='')
        db = sessionmaker()
        conn = await db.connection()

        steps = [
            'commit', # https://stackoverflow.com/questions/6506578/how-to-create-a-new-database-using-sqlalchemy
            f"CREATE DATABASE {app.config.PGSQL_DB};",
            # f"SELECT 'CREATE DATABASE {app.config.PGSQL_DB}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '{app.config.PGSQL_DB}');",
        ]
        for query in steps:
            try:
                await conn.run_sync(lambda connection: connection.execute(text(query)))
            except ProgrammingError as e:
                pass
        await conn.commit()
        await conn.close()

    @staticmethod
    def tables() -> list[DeclarativeBase]:
        return [
            Account,
            ChatRecord,
            ChatConversation,
            SharedConversation,
        ]

    @staticmethod
    async def init_table(db: AsyncSession, app: TAgenticApp):
        await Migration.init_db(app)

        steps = [
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        ] + [
            t.metadata.create_all for t in Migration.tables()
        ]

        conn = await db.connection()

        for query in steps:
            print(query)
            if type(query) is str:
                await conn.run_sync(lambda connection: connection.execute(text(query)))
            else:
                await conn.run_sync(query)

        await conn.commit()
        await conn.close()
        logging.info('Migration done')

    @staticmethod
    async def init(db: AsyncSession, app: TAgenticApp):
        # 检查数据库和表是否已初始化
        tbls = await Migration.check_tables(db)
        if len(tbls) > 0:
            logging.warning(f"[SetupInitApi] need to create tables: {tbls}")
            # 初始化数据库和表
            await Migration.init_table(db, app)
