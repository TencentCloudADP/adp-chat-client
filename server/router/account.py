from sanic import json, redirect
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from util.helper import get_remote_ip, get_path_base
from core.account import CoreAccount, CoreAccountProvider
from config import tagentic_config
from router import check_login, auto_login
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class CreateAccountApi(HTTPMethodView):
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("Email", type=str, required=True, location="json")
        parser.add_argument("Password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        account = await CoreAccount.create_account(request.ctx.db, email=args["Email"], password=args["Password"])

        account.Password = None
        account.PasswordSalt = None

        return json(account.to_dict())


class CustomerAccountApi(HTTPMethodView):
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("CustomerId", type=str, required=True, location="args")
        parser.add_argument("Name", type=str, required=False, default="", location="args")
        parser.add_argument("ExtraInfo", type=str, required=False, default="", location="args")
        parser.add_argument("Timestamp", type=int, required=False, location="args")
        parser.add_argument("Code", type=str, required=False, location="args")
        args = parser.parse_args(request)

        account = await CoreAccount.customer_auth(
            request.ctx.db, args["CustomerId"], args["Name"], args["Timestamp"], args["ExtraInfo"], args["Code"]
        )
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        response = redirect(get_path_base())
        response.add_cookie(
            "token",
            token,
            path=get_path_base(),
            max_age=tagentic_config.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
            secure=False,
        )
        return response


class AccountProviderListApi(HTTPMethodView):
    async def get(self, request: Request):
        providers = CoreAccountProvider.get_providers()

        return json({"Providers": providers})


class AccountInfoApi(HTTPMethodView):
    async def get(self, request: Request):
        on_response = None
        if app.config.AUTO_CREATE_ACCOUNT:
            # 自动创建账户
            on_response = await auto_login(request)
        else:
            check_login(request)

        account = await CoreAccount.get(request.ctx.db, request.ctx.account_id)

        account.Password = None
        account.PasswordSalt = None

        resp = json({"Info": account.to_dict()})
        if on_response:
            resp = on_response(resp)
        return resp


app.add_route(AccountProviderListApi.as_view(), "/account/providers")
# app.add_route(CreateAccountApi.as_view(), "/account/create")
app.add_route(CustomerAccountApi.as_view(), "/account/customer")
app.add_route(AccountInfoApi.as_view(), "/account/info")
