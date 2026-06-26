import logging
import traceback

from sanic import json
from sanic import exceptions

from app_factory import TAgenticApp
app = TAgenticApp.get_app()


def format_exception(exception):
    logging.error(f'{exception}')
    if type(exception) is not exceptions.NotFound:
        logging.error(traceback.format_exc())
    status_code = 500
    if hasattr(exception, 'status_code'):
        status_code = exception.status_code
    return {'Error': {'Message': str(exception), 'Exception': exception.__class__.__name__}}, status_code


# 全局异常捕获，按固定格式输出给客户端
@app.exception(Exception)
async def catch_anything(request, exception):
    body, status_code = format_exception(exception)
    return json(body, status=status_code)


# CancelledError（客户端断开连接等场景）不继承 Exception，需要单独捕获。
# 捕获后记录日志，清理 session 由 http.lifecycle.response signal 兜底完成。
import asyncio

@app.exception(asyncio.CancelledError)
async def catch_cancelled(request, exception):
    logging.warning('[catch_cancelled] request cancelled: %s %s', request.method, request.path)
    return json(
        {'Error': {'Message': 'Request cancelled', 'Exception': 'CancelledError'}},
        status=499
    )
