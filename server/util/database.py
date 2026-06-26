import asyncio
import logging
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import event
from app_factory import TAgenticApp


def create_db_engine(app: TAgenticApp, override_db: str = None) -> tuple[AsyncSession, sessionmaker]:
    db = app.config.PGSQL_DB
    if override_db is not None:
        db = override_db
    db_config = (
        f'{app.config.PGSQL_USER}:{app.config.PGSQL_PASSWORD}@'
        f'{app.config.PGSQL_HOST}:{app.config.PGSQL_PORT}/{db}'
    )
    db_engine = create_async_engine(
        f"postgresql+asyncpg://{db_config}",
        pool_size=20,
        max_overflow=20,
        pool_timeout=10,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

    # 连接池监控：当连接池耗尽时输出详细诊断信息
    sync_engine = db_engine.sync_engine

    @event.listens_for(sync_engine, "checkout")
    def _on_checkout(dbapi_conn, connection_rec, connection_proxy):
        pool = sync_engine.pool
        logging.debug(
            '[pool_monitor] checkout: pool_size=%d, checkedin=%d, checkedout=%d, overflow=%d',
            pool.size(), pool.checkedin(), pool.checkedout(), pool.overflow()
        )

    @event.listens_for(sync_engine, "checkin")
    def _on_checkin(dbapi_conn, connection_rec):
        pool = sync_engine.pool
        logging.debug(
            '[pool_monitor] checkin: pool_size=%d, checkedin=%d, checkedout=%d, overflow=%d',
            pool.size(), pool.checkedin(), pool.checkedout(), pool.overflow()
        )

    _sessionmaker = sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    return db_engine, _sessionmaker


def log_pool_status(label: str = ''):
    """手动输出当前连接池状态，供排查时调用。"""
    try:
        app = TAgenticApp.get_app()
        pool = app.config['db'].sync_engine.pool
        logging.info(
            '[pool_status] %s pool_size=%d, checkedin=%d, checkedout=%d, overflow=%d',
            label, pool.size(), pool.checkedin(), pool.checkedout(), pool.overflow()
        )
    except Exception:
        pass


@asynccontextmanager
async def db_connection():
    app = TAgenticApp.get_app()
    db = app.config['sessionmaker']()
    try:
        yield db
    except asyncio.CancelledError:
        logging.warning('[db_connection] CancelledError, rolling back')
        try:
            await db.rollback()
        except Exception:  # pylint: disable=broad-except
            pass
        raise
    finally:
        await db.close()


async def connect_with_retry(db: AsyncSession, retry_times=3, retry_interval=2):
    try:
        conn = await db.bind.connect()
        return conn
    except Exception as e:  # pylint: disable=broad-except
        logging.error(f"[connect_with_retry] {e}")
        if retry_times > 0:
            await asyncio.sleep(retry_interval)
            return await connect_with_retry(db, retry_times - 1, retry_interval)
        else:
            raise e
    return None
