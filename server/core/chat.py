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
from vendor.interface import BaseVendor, ApplicationInfo, ConversationCallback

class CoreChat:
    @staticmethod
    async def message(vendor_app: BaseVendor, db: AsyncSession, account_id: str, query: str, conversation_id: str, search_network: bool, custom_variables: dict):
        class CoreConversationCallback(ConversationCallback):
            async def create(self, title: str = None, conversation_id: str = None) -> ChatConversation:
                # create
                if title is None:
                    title = query[:10]
                conversation = await CoreConversation.create(db, account_id, vendor_app.application_id, title=title, conversation_id=conversation_id)
                return conversation

            async def update(self, conversation_id: str = None, title: str = None) -> ChatConversation:
                # update
                conversation = await CoreConversation.get(db, conversation_id)
                if conversation is None:
                    raise Exception(f'conversation not found: {conversation_id}')
                await CoreConversation.update(db, conversation, title=title)
                return conversation
        
        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            is_new_conversation = True

        async for message in vendor_app.chat(account_id, query, conversation_id, is_new_conversation, CoreConversationCallback(), search_network=search_network, custom_variables=custom_variables):
            yield message

class CoreMessage:
    @staticmethod
    async def list(db: AsyncSession, conversation_id: str) -> list[ChatRecord]:
        conversations = (await db.execute(select(ChatRecord).where(
            ChatRecord.ConversationId==conversation_id
        ).order_by(ChatRecord.CreatedAt))).scalars()
        return conversations
    @staticmethod
    async def create(db: AsyncSession, conversation_id: str, from_role: str, content: str) -> ChatRecord:
        message = ChatRecord(ConversationId=conversation_id, FromRole=from_role, Content=content)
        db.add(message)
        await db.commit()
        return message
