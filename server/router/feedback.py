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

class TCADPFeedbackRateApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("conversation_id", type=str, required=True, location="json")
        parser.add_argument("record_id", type=str, required=True, location="json")
        parser.add_argument("score", type=int, required=True, location="json")
        args = parser.parse_args(request)

        application_id = await CoreConversation.get_application_id(request.ctx.db, request.ctx.account_id, args['conversation_id'])
        app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==application_id][0]

        action = "RateMsgRecord"
        payload = {
            "RecordId": args['record_id'],
            "Score": args['score'],
            "BotAppKey": app_key,
   
        }
        resp = await tc_request(action, payload)
        return json(resp)
        # return json({"request_id": resp['Response']['RequestId']})

app.add_route(TCADPFeedbackRateApi.as_view(), "/feedback/rate")
