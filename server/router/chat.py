from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sqlalchemy import select
import logging

from router import login_required
from model import Account
from core.account import CoreAccount
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ChatApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        # parser.add_argument("email", type=str, required=True, location="json")
        # parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        # account = await CoreAccount.authenticate(request.ctx.db, args["email"], args["password"])
        # token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        return json({})

app.add_route(ChatApi.as_view(), "/chat")
