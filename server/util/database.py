from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app_factory import TAgenticApp
from config import tagentic_config


def create_db_engine(app: TAgenticApp, override_db: str = None):
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
