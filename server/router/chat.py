import asyncio
import logging

import sanic
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream
from sanic.exceptions import SanicException

from router import login_required, check_login
from core.chat import CoreChat
from core.conversation import CoreConversation
from core.share import CoreShareConversation
from app_factory import TAgenticApp
app: TAgenticApp = TAgenticApp.get_app()


class ChatMessageApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("Contents", type=list, required=True, location="json")
        parser.add_argument("ConversationId", type=str, location="json")
        parser.add_argument("ApplicationId", type=str, location="json")
        parser.add_argument("SearchNetwork", type=bool, default=True, location="json")
        parser.add_argument("CustomVariables", type=dict, default={}, location="json")
        args = parser.parse_args(request)
        logging.info(f"ChatMessageApi: {args}")

        application_id = args['ApplicationId']
        vendor_app = app.get_vendor_app(application_id)

        logging.info(f"[ChatMessageApi] ApplicationId: {application_id},\n\
            CustomVariables: {args['CustomVariables']},\n\
            vendor_app: {vendor_app}")

        async def streaming_fn(response):
            chat_gen = CoreChat.message(
                vendor_app,
                request.ctx.account_id,
                args['Contents'],
                args['ConversationId'],
                args['SearchNetwork'],
                args['CustomVariables']
            )
            try:
                async for data in chat_gen:
                    await response.write(data)
            except asyncio.CancelledError:
                logging.info("[ChatMessageApi] Client disconnected, closing upstream")
                await chat_gen.aclose()
                raise
        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')


class ChatMessageListApi(HTTPMethodView):
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ConversationId", type=str, required=False, location="args")
        parser.add_argument("LastRecordId", type=str, required=False, location="args")
        parser.add_argument("ShareId", type=str, required=False, location="args")
        args = parser.parse_args(request)

        if args["ConversationId"] is not None:
            check_login(request)
            application_id = await CoreConversation.get_application_id(
                request.ctx.db,
                request.ctx.account_id,
                args['ConversationId']
            )
            vendor_app = app.get_vendor_app(application_id)

            # 判断是否为 claw 模式：优先从 apps_info 缓存查找，找不到时动态获取
            is_claw = False
            for info in getattr(request.ctx, 'apps_info', []):
                if hasattr(info, 'ApplicationId'):
                    app_id = info.ApplicationId
                else:
                    app_id = info.get('ApplicationId', '')
                pattern = info.Pattern if hasattr(info, 'Pattern') else info.get('Pattern', '')
                if app_id == application_id and pattern == 'ClawAgent':
                    is_claw = True
                    break

            # 缓存中未找到该应用信息时，通过 vendor_app 动态获取 Pattern
            if not is_claw:
                def _get_app_id(info):
                    if hasattr(info, 'ApplicationId'):
                        return info.ApplicationId
                    return info.get('ApplicationId', '')

                found_in_cache = any(
                    _get_app_id(info) == application_id
                    for info in getattr(request.ctx, 'apps_info', [])
                )
                if not found_in_cache and hasattr(vendor_app, 'get_info'):
                    try:
                        app_info = await vendor_app.get_info()
                        if getattr(app_info, 'Pattern', None) == 'ClawAgent':
                            is_claw = True
                    except (OSError, ValueError, KeyError, AttributeError) as e:
                        logging.warning(
                            f'[ChatApi] get_info failed for {application_id}: {e}'
                        )

            if is_claw and hasattr(vendor_app, 'get_messages_v2'):
                # claw 模式：通过 DescribeConversationMessageList 获取完整 V2 数据
                result = await vendor_app.get_messages_v2(
                    request.ctx.db,
                    request.ctx.account_id,
                    args['ConversationId'],
                    app.config.CHAT_MESSAGE_PAGE_SIZE,
                    args['LastRecordId']
                )
                resp = {
                    'Response': {
                        'ApplicationId': application_id,
                        'Records': result['Records'],
                        'HasMoreBefore': result['HasMoreBefore'],
                        'LastRecordId': result['LastRecordId'],
                    }
                }
            else:
                # standard 模式：通过 GetMsgRecord 获取历史消息
                records = await vendor_app.get_messages(
                    request.ctx.db,
                    request.ctx.account_id,
                    args['ConversationId'],
                    app.config.CHAT_MESSAGE_PAGE_SIZE,
                    args['LastRecordId']
                )
                resp = {
                    'Response': {
                        'ApplicationId': application_id,
                        'Records': records,
                    }
                }
            return sanic.json(resp)

        if args["ShareId"] is not None:
            if args['LastRecordId'] is not None:
                # temporarily disable pagination loading for the share API
                result = []
            else:
                conversation = await CoreShareConversation.list(request.ctx.db, args["ShareId"])
                result = conversation.to_dict()
            return sanic.json({"Response": result})

        raise SanicException('ConversationId or ShareId is required')


class ChatConversationListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=False, location="args")
        args = parser.parse_args(request)

        conversations = await CoreConversation.list(
            request.ctx.db,
            request.ctx.account_id,
            application_id=args["ApplicationId"],
        )
        return sanic.json([conversation.to_dict() for conversation in conversations])


class ChatConversationDeleteApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ConversationId", type=str, required=True, location="json")
        args = parser.parse_args(request)

        await CoreConversation.delete(request.ctx.db, request.ctx.account_id, args["ConversationId"])
        return sanic.json({"Success": 1})


app.add_route(ChatMessageApi.as_view(), "/chat/message")
app.add_route(ChatMessageListApi.as_view(), "/chat/messages")
app.add_route(ChatConversationListApi.as_view(), "/chat/conversations")
app.add_route(ChatConversationDeleteApi.as_view(), "/chat/conversation/delete")
