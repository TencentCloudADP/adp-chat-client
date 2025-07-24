from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import asyncio
import aiohttp
import json
from util.tca import tc_request

from util.json_format import custom_dumps
from config import tagentic_config
from core.conversation import CoreConversation
from core.completion import CoreCompletion
from model.chat import ChatRecord, ChatConversation

class TCADPEventType(str, Enum):
    """
    The type of event.
    """
    REPLY = "reply"
    TOKEN_STAT = "token_stat"
    REFERENCE = "reference"
    ERROR = "error"
    THOUGHT = "thought"

# class TCADPChat:


class CoreChat:
    def message_new_conversation_id(conversation_id: str):
        event = {
            "type": "custom",
            "name": "new_conversation",
            "value": {
                "ConversationId": conversation_id,
            },
        }
        return event
    
    def message_conversation_update(conversation: ChatConversation):
        event = {
            "type": "custom",
            "name": "conversation_update",
            "value": conversation.to_dict(),
        }
        return event

    @staticmethod
    async def forward_request(account_id: str, bot_app_key: str, query: str, conversation_id: str, is_new_conversation: bool, new_text_message_cb: callable, search_network = True, custom_variables = {}):
        url = tagentic_config.TCADP_API_URL
        session_id = conversation_id
        visitor_biz_id = account_id
        async with aiohttp.ClientSession() as session:
            param = {
                "content": query,
                "bot_app_key": bot_app_key,
                "session_id": session_id,
                "visitor_biz_id": visitor_biz_id,
                "search_network": "enable" if search_network else "disable",
                "custom_variables": custom_variables,
                "incremental" : False,
            }
            print(param)
            headers = {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }
            
            async with session.post(url, headers=headers, data=json.dumps(param)) as resp:
                if resp.status != 200:
                    raise(Exception())

                if is_new_conversation:
                    yield ('data:'+custom_dumps(CoreChat.message_new_conversation_id(conversation_id))+'\n\n').encode()

                # 逐行读取事件流
                last_event_type = None
                last_message_test = ''
                last_message_id = ''
                last_from_role = ''
                try:
                    while True:
                        raw_line = await resp.content.readline()
                        if not raw_line:
                            break
                        line = raw_line.decode()
                        if ':' not in line:
                            continue
                        line_type, data = line.split(':', 1)
                        if line_type == 'data':
                            yield raw_line + '\n'.encode()
                except asyncio.CancelledError:
                    logging.info("forward_request: cancelled")
                    resp.close()
            logging.info(f"forward_request: done")

    @staticmethod
    async def message(db: AsyncSession, account_id: str, query: str, conversation_id: str, application_id: str, app_key: str, search_network: bool, custom_variables: dict):
        async def new_text_message(message_id: str, from_role: str, content: str):
            message = await CoreMessage.create(db, conversation_id, from_role, content)
            logging.info(f"forward_request: {message_id}, {content}, {message.Id}")
        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            is_new_conversation = True
            title = query[:10]
            conversation = await CoreConversation.create(db, account_id, application_id, title=title)
        else:
            conversation = await CoreConversation.get(db, conversation_id)
            # 更新时间
            await CoreConversation.update(db, conversation)
            yield ('data:'+custom_dumps(CoreChat.message_conversation_update(conversation))+'\n\n').encode()
        conversation_id = str(conversation.Id)
        async for message in CoreChat.forward_request(account_id, app_key, query, conversation_id, is_new_conversation, new_text_message, search_network=search_network, custom_variables=custom_variables):
            yield message

        if is_new_conversation:
            try:
                # 生成标题
                completion = CoreCompletion(system_prompt = '请从以下对话中提取一个最核心的主题，用于对话列表展示。要求：\n1. 用5-10个汉字概括\n2. 优先选择：最新进展/待解决问题/双方共识\n\n请直接输出提炼结果，不要解释。')
                summarize = await completion.chat(f'user: {query}\n\nassistance:')
                await CoreConversation.update(db, conversation, title = summarize)
                yield ('data:'+custom_dumps(CoreChat.message_conversation_update(conversation))+'\n\n').encode()
            except Exception as e:
                logging.error(f'failed to summarize with model. error: {e}')

class CoreMessage:
    @staticmethod
    async def list(db: AsyncSession, conversation_id: str) -> list[ChatRecord]:
        conversations = (await db.execute(select(ChatRecord).where(
            ChatRecord.ConversationId==conversation_id
        ).order_by(ChatRecord.CreatedAt))).scalars()
        return conversations

    @staticmethod
    async def list_from_remote(db: AsyncSession, app_key: str, conversation_id: str, last_record_id: str = None) -> list:
        action = "GetMsgRecord"
        payload = {
            "Type": 5,
            "Count": 4,
            "SessionId": conversation_id,
            "BotAppKey": app_key,
        }
        if last_record_id is not None:
            payload['LastRecordId'] = last_record_id
        resp = await tc_request(action, payload)
        if 'Error' in resp['Response']:
            raise Exception(resp['Response']['Error'])
        return resp['Response']['Records']

    @staticmethod
    async def create(db: AsyncSession, conversation_id: str, from_role: str, content: str) -> ChatRecord:
        message = ChatRecord(ConversationId=conversation_id, FromRole=from_role, Content=content)
        db.add(message)
        await db.commit()
        return message
