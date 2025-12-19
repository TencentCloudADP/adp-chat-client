import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app_factory import TAgenticApp
from config import tagentic_config


def create_db_engine(app: TAgenticApp, override_db: str = None) -> tuple[AsyncSession, sessionmaker]:
    db = app.config.PGSQL_DB
    if override_db is not None:
        db = override_db
    db_config = (
        f'{app.config.PGSQL_USER}:{app.config.PGSQL_PASSWORD}@'
        f'{app.config.PGSQL_HOST}:{app.config.PGSQL_PORT}/{db}'
    )
    db_engine = create_async_engine(f"postgresql+asyncpg://{db_config}", echo=(tagentic_config.LOG_LEVEL == 'DEBUG'))
    _sessionmaker = sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    return db_engine, _sessionmaker


async def connect_with_retry(db: AsyncSession, retry_times=3, retry_interval=2):
    try:
        conn = await db.bind.connect()
        return conn
    except Exception as e:  # pylint: disable=broad-except
        logging.error(f"[connect_with_retry] {e}")
        if retry_times > 0:
            await asyncio.sleep(retry_interval)
            return await connect_with_retry(db, retry_times - 1, retry_interval)
    return None
