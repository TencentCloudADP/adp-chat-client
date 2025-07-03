from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sqlalchemy import select
import logging

from util.helper import get_remote_ip
from model import Account
from core.account import CoreAccount
from config import tagentic_config
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class LoginApi(HTTPMethodView):
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("email", type=str, required=True, location="json")
        parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        account = await CoreAccount.authenticate(request.ctx.db, args["email"], args["password"])
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        response = json({"token": token})
        response.add_cookie(
            "token",
            token,
            max_age=tagentic_config.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
            secure=False,
        )
        return response


app.add_route(LoginApi.as_view(), "/login")
