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

from ag_ui.core import EventType, TextMessageContentEvent, CustomEvent
from ag_ui.encoder import EventEncoder

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
        event = CustomEvent(
            type=EventType.CUSTOM,
            name='new_conversation',
            value={
                "conversation_id": conversation_id,
            }
        )
        return event

    @staticmethod
    async def forward_request(account_id: str, query: str, conversation_id: str, is_new_conversation: bool, new_text_message_cb: callable):
        url = tagentic_config.TCADP_API_URL
        bot_app_key = tagentic_config.TCADP_APP_KEY
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

                # Initialize the encoder
                encoder = EventEncoder()

                if is_new_conversation:
                    yield encoder.encode(CoreChat.message_new_conversation_id(conversation_id))

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
                        # yield raw_line
                        try:
                            data = json.loads(data)
                            data_type = data['type']
                            message_id = data['payload']['record_id']
                            from_role = ''
                            if data_type == TCADPEventType.REPLY:
                                if data['payload']['is_from_self']:
                                    from_role = 'user'
                                else:
                                    from_role = data['payload']['from_name']
                            event = None
                            if data_type == TCADPEventType.REPLY:
                                event = TextMessageContentEvent(
                                    type=EventType.TEXT_MESSAGE_CONTENT,
                                    message_id=message_id,
                                    delta=data['payload']['content']
                                )
                            elif data_type == TCADPEventType.THOUGHT:
                                # print(data)
                                procedure = data['payload']['procedures'][-1]
                                event = CustomEvent(
                                    type=EventType.CUSTOM,
                                    name='thought',
                                    value={
                                        "message_id": message_id,
                                        "target_agent_name": procedure['target_agent_name'],
                                        "title": procedure['title'],
                                        "delta": procedure['debugging']['content'] if 'content' in procedure['debugging'] else ''
                                    }
                                )
                            if event is not None:
                                if last_event_type != event.type or (last_event_type == EventType.TEXT_MESSAGE_CONTENT and last_message_id != message_id):
                                    if last_event_type == EventType.TEXT_MESSAGE_CONTENT:
                                        await new_text_message_cb(last_message_id, last_from_role, last_message_test)
                                    last_event_type = event.type
                                    last_message_test = ''
                                    last_message_id = message_id
                                    last_from_role = from_role
                                if last_event_type == EventType.TEXT_MESSAGE_CONTENT:
                                    last_message_test += event.delta
                                yield encoder.encode(event)
                        except Exception as e:
                            logging.error(e, data)
                    # print(f"Received: {line.strip()}")
                
                if last_event_type == EventType.TEXT_MESSAGE_CONTENT:
                    await new_text_message_cb(last_message_id, last_from_role, last_message_test)

        # # Initialize the encoder
        # encoder = EventEncoder()
        # for i in range(10):
        #     await asyncio.sleep(0.1)
        #     event = TextMessageContentEvent(
        #         type=EventType.TEXT_MESSAGE_CONTENT,
        #         message_id="msg_123",
        #         delta=f"Hello, world! {input} {i}"
        #     )
        #     yield encoder.encode(event)

    @staticmethod
    async def messages(db: AsyncSession, account_id: str, query: str, conversation_id: str):
        async def new_text_message(message_id: str, from_role: str, content: str):
            message = await CoreMessage.create(db, conversation_id, from_role, content)
            logging.info(f"forward_request: {message_id}, {content}, {message.id}")
        is_new_conversation = False
        if conversation_id is None:
            title = query[:10]
            is_new_conversation = True
            conversation = await CoreConversation.create(db, account_id, title=title)
            conversation_id = str(conversation.id)
        async for message in CoreChat.forward_request(account_id, query, conversation_id, is_new_conversation, new_text_message):
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
