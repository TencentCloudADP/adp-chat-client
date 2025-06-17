from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sqlalchemy import select
import logging

from util.helper import get_remote_ip
from model import Account
from core.account import CoreAccount
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class CreateAccountApi(HTTPMethodView):
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("email", type=str, required=True, location="json")
        parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        account = await CoreAccount.create_account(request.ctx.db, args["email"], args["password"])

        account.password = None
        account.password_salt = None

        return json(account.to_dict())

app.add_route(CreateAccountApi.as_view(), "/account/create")
