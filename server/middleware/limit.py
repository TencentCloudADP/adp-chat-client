import logging

import limits
from sanic.request.types import Request

from util.helper import get_remote_ip
from core.error.server import RateLimit
from app_factory import TAgenticApp
from router import check_login


logger = logging.getLogger(__name__)
app = TAgenticApp.get_app()
limits_storage = limits.aio.storage.MemoryStorage()
moving_window = limits.aio.strategies.MovingWindowRateLimiter(limits_storage)
limit_rule = limits.parse(app.config.RATE_LIMIT)


@app.middleware("request")
async def limit_handler(request: Request):
    if request.server_path.startswith("/static"):
        return

    ip = get_remote_ip(request)
    account_id = None

    try:
        check_login(request)
        account_id = request.ctx.account_id
    except:  # pylint: disable=bare-except
        pass

    id = account_id or ip
    too_many_req = not await moving_window.hit(limit_rule, f"{request.server_path},{id}")
    if too_many_req:
        logger.warning(f"[limiter] too many requests to: {request.server_path} ip: {ip} account_id: {account_id}")
        raise RateLimit("Too many requests")
