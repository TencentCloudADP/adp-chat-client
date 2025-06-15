from model import Account
from sanic import json
from sqlalchemy import select

from app_factory import TAgenticApp
app = TAgenticApp.get_app()

# @app.get("/init")
# async def init(request):
#     session = request.ctx.session
#     async with db_engine.begin() as conn:
#         # TODO:
#         # 1.CREATE db
#         # 2.CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
#         ret = await conn.run_sync(Account.metadata.create_all)
#     return json(ret)

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
