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
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ChatMessagesApi(HTTPMethodView):
    # @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        # parser.add_argument("email", type=str, required=True, location="json")
        # parser.add_argument("password", type=str, required=True, location="json")
        args = parser.parse_args(request)

        async def streaming_fn(response):
            async for data in CoreChat.messages(request.ctx.db, 'in'):
                await response.write(data)
        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')

app.add_route(ChatMessagesApi.as_view(), "/chat/messages")
