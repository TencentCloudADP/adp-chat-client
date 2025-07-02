import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from asyncpg.exceptions import InvalidCatalogNameError, DuplicateDatabaseError
from sqlalchemy.exc import ProgrammingError
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)
from model.account import Account
from model.chat import ChatMessage, ChatConversation
from middleware.database import create_db_engine

from app_factory import TAgenticApp
app = TAgenticApp.get_app()

class Migration:
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
    async def init(db: AsyncSession, app: TAgenticApp):
        await Migration.init_db(app)

        steps = [
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
            Account.metadata.create_all,
            ChatMessage.metadata.create_all,
            ChatConversation.metadata.create_all,
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
        app.stop()

@app.listener('before_server_start')
async def connect_db(app, loop):
    await Migration.init(app.config['sessionmaker'](), app)
