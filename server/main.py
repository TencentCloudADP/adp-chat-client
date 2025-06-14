import asyncio
import sanic
from sanic.exceptions import SanicException
from sanic import Sanic, Blueprint, response, text
import time
import json
from termcolor import colored
import traceback
from inspect import getmembers
# from middleware import ioa, project as project_mw, role as role_mw
# from router import cron, deployment, experiment, feature_engineering, feature_extraction, filemanager, model, project, role, sys, table, task, user, warehouse
# from task import config

app = Sanic("agentic")
app.config.RESPONSE_TIMEOUT = 600


def format_exception(exception):
    print('[err]', str(exception))
    print(traceback.format_exc())
    status_code = 500
    if hasattr(exception, 'status_code'):
        status_code = exception.status_code
    return {'ret': 'failed', 'detail': {'message': str(exception)}}, status_code

# 全局异常捕获，按固定格式输出给客户端
@app.exception(Exception)
async def catch_anything(request, exception):
    body, status_code = format_exception(exception)
    return sanic.json(body, status=status_code)

# 秀一下剥洋葱
@app.middleware("request")
async def rec_time(request):
    request.ctx.ts = time.time()
    # request.ctx.user = await extract_user_from_request(request)
@app.middleware('response')
async def rec_time(request, response):
    ts = time.time()
    username = request.headers['staffname'] if 'staffname' in request.headers else '-'
    duration = ts - request.ctx.ts
    print('[req] {}s {} {} {} {}'.format(colored('{:.3f}'.format(duration), 'green' if duration < 0.1 else 'yellow' if duration < 0.5 else 'red'), request.ip, request.method, request.path, username))
    # response.headers["x-xss-protection"] = "1; mode=block"

# 注册中间件
# middlewares = []
# if 'noauth' in config.auth:
#     @app.middleware('request')
#     async def noauth(request):
#         request.ctx.username = ''
# if 'ioa' in config.auth:
#     middlewares += [ioa]
# middlewares += [project_mw, role_mw]
# for m in middlewares:
#     for name, member in getmembers(m):
#         if name == 'request_handler':
#             app.register_middleware(member, "request")
#         elif name == 'response_handler':
#             app.register_middleware(member, "response")

# 注册子模块
# modules = [cron, deployment, experiment, feature_engineering, feature_extraction, filemanager, model, project, role, sys, table, task, user, warehouse]
# for module in modules:
#     for _, member in getmembers(module):
#         if isinstance(member, Blueprint):
#             app.blueprint(member)

# 首页重定向
@app.get('/')
async def handler(request):
    return response.redirect('/static/app/index')

# 静态文件（客户端）
app.static('/static/app/index', './static/app/index.html', name='index')
app.static('/static/app', './static/app', name='dir')

# # 启动监听
# app.run(host='0.0.0.0', port=8008, access_log=False, debug=True)
