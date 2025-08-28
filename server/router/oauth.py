from sanic import redirect
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request

from util.helper import get_remote_ip, get_path_base
from core.oauth import CoreOAuth
from core.account import CoreAccount
from config import tagentic_config
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class OAuthCallbackApi(HTTPMethodView):
    async def get(self, request: Request, provider: str):
        parser = reqparse.RequestParser()
        parser.add_argument("code", type=str, required=True, location="args")
        args = parser.parse_args(request)

        account = await CoreOAuth.callback(request.ctx.db, provider, args["code"])
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


app.add_route(OAuthCallbackApi.as_view(), "/oauth/callback/<provider>")
