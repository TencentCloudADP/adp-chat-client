from sanic import json, redirect
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sqlalchemy import select
import logging

from util.helper import get_remote_ip
from model import Account
from core.account import CoreAccount, CoreAccountProvider
from config import tagentic_config
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class CreateAccountApi(HTTPMethodView):
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("email", type=str, required=True, location="json")
        parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        account = await CoreAccount.create_account(request.ctx.db, email=args["email"], password=args["password"])

        account.password = None
        account.password_salt = None

        return json(account.to_dict())

class CustomerAccountApi(HTTPMethodView):
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("customer_id", type=str, required=True, location="args")
        parser.add_argument("name", type=str, required=False, location="args")
        parser.add_argument("timestamp", type=int, required=False, location="args")
        parser.add_argument("code", type=str, required=False, location="args")
        args = parser.parse_args(request)

        account = await CoreAccount.customer_auth(request.ctx.db, args["customer_id"], args["name"], args["timestamp"], args["code"])
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        # TODO: read from config
        response = redirect("/")
        response.add_cookie(
            "token",
            token,
            max_age=tagentic_config.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
            secure=False,
        )
        return response

class AccountProviderListApi(HTTPMethodView):
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        args = parser.parse_args(request)

        providers = CoreAccountProvider.getProviders()

        return json({"providers": providers})

app.add_route(AccountProviderListApi.as_view(), "/account/providers")
app.add_route(CreateAccountApi.as_view(), "/account/create")
app.add_route(CustomerAccountApi.as_view(), "/account/customer")
