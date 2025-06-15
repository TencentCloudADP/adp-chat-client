from app_factory import TAgenticApp
from contextvars import ContextVar
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

app = TAgenticApp.get_app()

db_config = f'{app.config.PGSQL_USER}:{app.config.PGSQL_PASSWORD}@{app.config.PGSQL_HOST}:{app.config.PGSQL_PORT}/{app.config.PGSQL_DB}'
db_engine = create_async_engine(f"postgresql+asyncpg://{db_config}", echo=True)

_sessionmaker = sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)

_base_model_session_ctx = ContextVar("session")

@app.middleware("request")
async def inject_session(request):
    request.ctx.session = _sessionmaker()
    request.ctx.session_ctx_token = _base_model_session_ctx.set(request.ctx.session)

@app.middleware("response")
async def close_session(request, response):
    if hasattr(request.ctx, "session_ctx_token"):
        _base_model_session_ctx.reset(request.ctx.session_ctx_token)
        await request.ctx.session.close()
