from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, desc
from model.chat import SharedConversation
from model.account import Account
import asyncio
import aiohttp
import json

from config import tagentic_config


class CoreShareConversation:

    @staticmethod
    async def create(db: AsyncSession, account_id: str, conversation_id: str, application_id: str, records: list) -> SharedConversation:
        shared = SharedConversation(AccountId=account_id, ApplicationId=application_id, ParentConversationId=conversation_id, Records=records)
        db.add(shared)
        await db.commit()
   
        return shared

    @staticmethod
    async def list(db: AsyncSession, share_id: str) -> SharedConversation:
        records = (await db.execute(
            select(SharedConversation)
            .where(
                SharedConversation.Id==share_id
            )
            .limit(1)
        )).scalar()
        return records

