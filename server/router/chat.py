from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream
from sqlalchemy import select
import logging
import asyncio

from router import login_required
from model import Account
from core.chat import CoreChat
from core.conversation import CoreConversation
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ChatMessageApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("query", type=str, required=True, location="json")
        parser.add_argument("conversation_id", type=str, location="json")
        args = parser.parse_args(request)

        async def streaming_fn(response):
            async for data in CoreChat.messages(request.ctx.db, request.ctx.account_id, args['query'], args['conversation_id']):
                await response.write(data)
        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')

class ChatConversationListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        args = parser.parse_args(request)
        conversations = await CoreConversation.list(request.ctx.db, request.ctx.account_id)
        return json([conversation.to_dict() for conversation in conversations])


app.add_route(ChatMessageApi.as_view(), "/chat/message")
app.add_route(ChatConversationListApi.as_view(), "/chat/conversation")
