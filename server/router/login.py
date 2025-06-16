from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sqlalchemy import select
import logging

from model import Account
from core.account import CoreAccount
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class LoginApi(HTTPMethodView):
    async def post(self, request):
        parser = reqparse.RequestParser()
        parser.add_argument("email", type=str, required=True, location="json")
        parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        return json(args)

app.add_route(LoginApi.as_view(), "/login")
