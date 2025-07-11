from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from model.chat import ChatConversation
from model.account import Account
import asyncio
import aiohttp
import json

from config import tagentic_config


class CoreConversation:
    @staticmethod
    async def list(db: AsyncSession, account_id: str) -> list[ChatConversation]:
        conversations = (await db.execute(select(ChatConversation).where(
            ChatConversation.account_id==account_id
        ).order_by(desc(ChatConversation.last_active_at)))).scalars()
        return conversations

    @staticmethod
    async def get_application_id(db: AsyncSession, account_id: str, conversation_id: str) -> str:
        conversation = (await db.execute(select(ChatConversation).where(
            ChatConversation.account_id==account_id,
            ChatConversation.id==conversation_id,
        ).limit(1))).scalar()
        return conversation.application_id

    @staticmethod
    async def create(db: AsyncSession, account_id: str, application_id: str, title: str = "new conversation") -> ChatConversation:
        conversation = ChatConversation(account_id=account_id, application_id=application_id, title=title)
        db.add(conversation)
        await db.commit()
        return conversation
