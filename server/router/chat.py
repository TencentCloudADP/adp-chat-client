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


class ChatMessageApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("query", type=str, required=True, location="json")
        parser.add_argument("conversation_id", type=str, location="json")
        parser.add_argument("agent_id", type=str, location="json")
        args = parser.parse_args(request)
        logging.info(f"ChatMessageApi: {args}")

        agent_id = args['agent_id']
        app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==agent_id][0]

        async def streaming_fn(response):
            async for data in CoreChat.message(request.ctx.db, request.ctx.account_id, args['query'], args['conversation_id'], agent_id, app_key):
                await response.write(data)
        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')

class ChatMessageListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("conversation_id", type=str, required=True, location="args")
        args = parser.parse_args(request)
        messages = await CoreMessage.list(request.ctx.db, args['conversation_id'])
        return json([message.to_dict() for message in messages])

class ChatConversationListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        args = parser.parse_args(request)
        conversations = await CoreConversation.list(request.ctx.db, request.ctx.account_id)
        return json([conversation.to_dict() for conversation in conversations])

class TCADPChatMessageListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("conversation_id", type=str, required=True, location="args")
        args = parser.parse_args(request)

        agent_id = await CoreConversation.get_agent_id(request.ctx.db, request.ctx.account_id, args['conversation_id'])
        app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==agent_id][0]

        action = "GetMsgRecord"
        payload = {
            "Type": 5,
            "Count": 1000,
            "SessionId": args['conversation_id'],
            "BotAppKey": app_key,
   
        }
        resp = await tc_request(action, payload)
        resp['Response']['AgentId'] = agent_id
        return json(resp)

app.add_route(ChatMessageApi.as_view(), "/chat/message")
# app.add_route(ChatMessageListApi.as_view(), "/chat/messages")
app.add_route(TCADPChatMessageListApi.as_view(), "/chat/messages")
app.add_route(ChatConversationListApi.as_view(), "/chat/conversations")
