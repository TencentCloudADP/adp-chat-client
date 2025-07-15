from contextvars import ContextVar

from core.migration import Migration
from util.database import create_db_engine
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

_base_model_db_ctx = ContextVar("db")

@app.middleware("request")
async def inject_session(request):
    request.ctx.db = app.config['sessionmaker']()
    request.ctx.db_ctx_token = _base_model_db_ctx.set(request.ctx.db)

@app.middleware("response")
async def close_session(request, response):
    if hasattr(request.ctx, "db_ctx_token"):
        await request.ctx.db.close()
        _base_model_db_ctx.reset(request.ctx.db_ctx_token)

@app.listener('before_server_start')
async def connect_db(app, loop):
    db_engine, _sessionmaker = create_db_engine(app)
    app.config['db'] = db_engine
    app.config['sessionmaker'] = _sessionmaker
    await Migration.init(app.config['sessionmaker'](), app)

@app.listener('before_server_stop')
async def disconnect_db(app, loop):
    await app.config['db'].dispose()
