from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream
from sqlalchemy import select
import logging
import asyncio

from config import tagentic_config
from util.tca import tc_request
from router import login_required
from model import Account
from core.chat import CoreChat
from core.conversation import CoreConversation
from core.chat import CoreMessage
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class AgentListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        args = parser.parse_args(request)

        apps_info = request.ctx.apps_info
        apps_info = [{k:v for k,v in info.items() if k not in ['AppKey']} for info in apps_info]
        return json({"agents": apps_info})

app.add_route(AgentListApi.as_view(), "/agent/list")
