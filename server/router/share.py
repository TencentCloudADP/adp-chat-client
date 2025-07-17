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
from core.share import CoreShareConversation
from core.chat import CoreMessage, CoreConversation
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ShareCreateApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ConversationId", type=str, required=True, location="json")
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        parser.add_argument("RecordIds", type=list[str], required=True, location="json")
        args = parser.parse_args(request)
        # print(args['records'])

        application_id = await CoreConversation.get_application_id(request.ctx.db, request.ctx.account_id, args['ConversationId'])
        app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==application_id][0]

        # messages = await CoreMessage.list(request.ctx.db, args['ConversationId'])
        records = await CoreMessage.list_from_remote(request.ctx.db, app_key, args['ConversationId'])
        records = [record for record in records if record["RecordId"] in args["RecordIds"]]

        shared = await CoreShareConversation.create(request.ctx.db, request.ctx.account_id, args["ConversationId"], args["ApplicationId"], records)

        return json({"ShareId": shared.Id})

app.add_route(ShareCreateApi.as_view(), "/share/create")
