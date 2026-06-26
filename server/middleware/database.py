import logging
from contextvars import ContextVar

from core.migration import Migration
from util.database import create_db_engine
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

_base_model_db_ctx = ContextVar("db")

# SSE/Streaming 路由不需要中间件 session，这些路由内部通过 db_connection() 自行管理
_SKIP_SESSION_PATHS = frozenset({'/chat/message', '/file/parse'})


async def _cleanup_session(request):
    """安全关闭 request 上绑定的 DB session。

    此函数会被 response middleware 和 http.lifecycle.response signal 双重调用，
    通过 `_db_cleaned` 标记保证只执行一次，防止 CancelledError / 连接断开 等场景
    导致 response middleware 被跳过而 session 永远不归还连接池。
    """
    if getattr(request.ctx, '_db_cleaned', False):
        return
    if not hasattr(request.ctx, 'db_ctx_token'):
        return
    request.ctx._db_cleaned = True
    try:
        if request.ctx.db.is_active:
            await request.ctx.db.rollback()
    except Exception as e:
        logging.warning('[_cleanup_session] rollback failed: %s', e)
    finally:
        try:
            await request.ctx.db.close()
        except Exception as e:
            logging.warning('[_cleanup_session] close failed: %s', e)
        try:
            _base_model_db_ctx.reset(request.ctx.db_ctx_token)
        except Exception:
            pass


@app.middleware("request")
async def inject_session(request):
    if request.server_path in _SKIP_SESSION_PATHS:
        return
    request.ctx.db = app.config['sessionmaker']()
    request.ctx.db_ctx_token = _base_model_db_ctx.set(request.ctx.db)
    request.ctx._db_cleaned = False


@app.middleware("response")
async def close_session(request, response):
    await _cleanup_session(request)


# 双保险：当 response middleware 因 CancelledError / 连接异常 被跳过时，
# Sanic 的 http.lifecycle.response signal 仍然会触发，确保 session 被归还。
@app.signal("http.lifecycle.response")
async def signal_cleanup_session(request, **_):
    try:
        await _cleanup_session(request)
    except Exception as e:
        logging.warning('[signal_cleanup_session] cleanup failed: %s', e)


@app.listener('before_server_start')
async def connect_db(app, loop):
    db_engine, _sessionmaker = create_db_engine(app)
    app.config['db'] = db_engine
    app.config['sessionmaker'] = _sessionmaker
    db = app.config['sessionmaker']()
    try:
        await Migration.init(db, app)
    finally:
        await db.close()


@app.listener('before_server_stop')
async def disconnect_db(app, loop):
    await app.config['db'].dispose()
