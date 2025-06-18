from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.chat import ChatConversation
from model.account import Account
import asyncio
import aiohttp
import json

from ag_ui.core import EventType, TextMessageContentEvent
from ag_ui.encoder import EventEncoder

from config import tagentic_config


class CoreConversation:
    @staticmethod
    async def list(db: AsyncSession, account_id: str) -> list[ChatConversation]:
        conversations = (await db.execute(select(ChatConversation).where(
            ChatConversation.account_id==account_id
        ))).scalars()
        return conversations

    @staticmethod
    async def create(db: AsyncSession, account_id: str) -> ChatConversation:
        conversation = ChatConversation(account_id=account_id, title="new conversation")
        db.add(conversation)
        await db.commit()
        return conversation
