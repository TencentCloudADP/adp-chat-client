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

from config import tagentic_config
from core.conversation import CoreConversation
from model.chat import ChatMessage

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
                "conversation_id": conversation_id,
            },
        }
        return event

    @staticmethod
    async def forward_request(account_id: str, bot_app_key: str, query: str, conversation_id: str, is_new_conversation: bool, new_text_message_cb: callable):
        url = tagentic_config.TCADP_API_URL
        session_id = conversation_id
        visitor_biz_id = account_id
        async with aiohttp.ClientSession() as session:
            param = {
                "content": query,
                "bot_app_key": bot_app_key,
                "session_id": session_id,
                "visitor_biz_id": visitor_biz_id,
                "incremental" : True,
            }
            headers = {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }
            
            async with session.post(url, headers=headers, data=json.dumps(param)) as resp:
                if resp.status != 200:
                    raise(Exception())

                if is_new_conversation:
                    yield ('data:'+json.dumps(CoreChat.message_new_conversation_id(conversation_id))+'\n\n').encode()

                # 逐行读取事件流
                last_event_type = None
                last_message_test = ''
                last_message_id = ''
                last_from_role = ''
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
                # if last_event_type == EventType.TEXT_MESSAGE_CONTENT:
                #     await new_text_message_cb(last_message_id, last_from_role, last_message_test)

    @staticmethod
    async def message(db: AsyncSession, account_id: str, query: str, conversation_id: str, agent_id: str, app_key: str):
        async def new_text_message(message_id: str, from_role: str, content: str):
            message = await CoreMessage.create(db, conversation_id, from_role, content)
            logging.info(f"forward_request: {message_id}, {content}, {message.id}")
        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            title = query[:10]
            is_new_conversation = True
            conversation = await CoreConversation.create(db, account_id, agent_id, title=title)
            conversation_id = str(conversation.id)
        async for message in CoreChat.forward_request(account_id, app_key, query, conversation_id, is_new_conversation, new_text_message):
            yield message

class CoreMessage:
    @staticmethod
    async def list(db: AsyncSession, conversation_id: str) -> list[ChatMessage]:
        conversations = (await db.execute(select(ChatMessage).where(
            ChatMessage.conversation_id==conversation_id
        ).order_by(ChatMessage.created_at))).scalars()
        return conversations

    @staticmethod
    async def create(db: AsyncSession, conversation_id: str, from_role: str, content: str) -> ChatMessage:
        message = ChatMessage(conversation_id=conversation_id, from_role=from_role, content=content)
        db.add(message)
        await db.commit()
        return message
