import asyncio
import sanic
from sanic.exceptions import SanicException
from sanic import Sanic, Blueprint, response, text
import time
from sanic import json
from termcolor import colored
import traceback
from inspect import getmembers
# from middleware import ioa, project as project_mw, role as role_mw
# from router import cron, deployment, experiment, feature_engineering, feature_extraction, filemanager, model, project, role, sys, table, task, user, warehouse
# from task import config

import ujson
import functools
from datetime import datetime, date
def datetime_to_json_formatting(o):
    if isinstance(o, (date, datetime)):
        return o.strftime('%Y-%m-%d %H:%M:%S')

custom_dumps = functools.partial(ujson.dumps, default=datetime_to_json_formatting)


app = Sanic("agentic", dumps=custom_dumps)
app.config.RESPONSE_TIMEOUT = 600





from contextvars import ContextVar
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

db_config = 'postgres:123456@tiaml.woa.com:15432/test'
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

from model import Account

@app.get("/init")
async def init(request):
    session = request.ctx.session
    async with db_engine.begin() as conn:
        # TODO:
        # 1.CREATE db
        # 2.CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        ret = await conn.run_sync(Account.metadata.create_all)
    return json(ret)

@app.get("/user")
async def create_user(request):
    session = request.ctx.session
    async with session.begin():
        user = Account(name="foo", email="bar")
        session.add_all([user])
    return json(user.to_dict())

@app.get("/user/<pk:str>")
async def get_user(request, pk):
    session = request.ctx.session
    async with session.begin():
        stmt = select(Account).where(Account.id == pk)
        result = await session.execute(stmt)
        user = result.scalar()

    if not user:
        return json({})
    return json(user.to_dict())




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
