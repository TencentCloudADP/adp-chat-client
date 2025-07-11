from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream
from sanic.exceptions import SanicException
from sqlalchemy import select
import logging
import asyncio

from config import tagentic_config
from util.tca import tc_request
from router import login_required, check_login
from model import Account
from core.chat import CoreChat, CoreMessage
from core.conversation import CoreConversation
from core.share import CoreShareConversation
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ChatMessageApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("query", type=str, required=True, location="json")
        parser.add_argument("conversation_id", type=str, location="json")
        parser.add_argument("application_id", type=str, location="json")
        args = parser.parse_args(request)
        logging.info(f"ChatMessageApi: {args}")

        application_id = args['application_id']
        app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==application_id][0]

        async def streaming_fn(response):
            async for data in CoreChat.message(request.ctx.db, request.ctx.account_id, args['query'], args['conversation_id'], application_id, app_key):
                await response.write(data)
        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')

class ChatMessageListApi(HTTPMethodView):
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("conversation_id", type=str, required=False, location="args")
        parser.add_argument("share_id", type=str, required=False, location="args")
        args = parser.parse_args(request)

        if args["conversation_id"] is not None:
            check_login(request)
            application_id = await CoreConversation.get_application_id(request.ctx.db, request.ctx.account_id, args['conversation_id'])
            app_key = [app['AppKey'] for app in request.ctx.apps_info if app['AppBizId']==application_id][0]

            # messages = await CoreMessage.list(request.ctx.db, args['conversation_id'])
            messages = await CoreMessage.list_from_remote(request.ctx.db, app_key, args['conversation_id'])
            resp = {
                'Response': {
                    'ApplicationId': application_id,
                    'Records': messages,
                }
            }
            return json(resp)

        if args["share_id"] is not None:
            conversation = await CoreShareConversation.list(request.ctx.db, args["share_id"])
            return json({"Response": conversation.to_dict()})

        raise SanicException(f'conversation_id or share_id is required')

class ChatConversationListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        args = parser.parse_args(request)
        conversations = await CoreConversation.list(request.ctx.db, request.ctx.account_id)
        return json([conversation.to_dict() for conversation in conversations])

app.add_route(ChatMessageApi.as_view(), "/chat/message")
app.add_route(ChatMessageListApi.as_view(), "/chat/messages")
app.add_route(ChatConversationListApi.as_view(), "/chat/conversations")
