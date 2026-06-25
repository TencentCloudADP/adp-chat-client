from datetime import UTC, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sanic.exceptions import SanicException
from model.chat import ChatConversation


class CoreConversation:
    @staticmethod
    async def list(db: AsyncSession, account_id: str) -> list[ChatConversation]:
        conversations = (await db.execute(select(ChatConversation).where(
            ChatConversation.AccountId == account_id
        ).order_by(desc(ChatConversation.LastActiveAt)))).scalars()
        return conversations

    @staticmethod
    async def delete(db: AsyncSession, account_id: str, conversation_id: str):
        conversation = (await db.execute(select(ChatConversation).where(
            ChatConversation.AccountId == account_id,
            ChatConversation.Id == conversation_id
        ).limit(1))).scalar()
        if conversation is None:
            raise SanicException("conversation not found", status_code=404)
        await db.delete(conversation)
        await db.commit()

    @staticmethod
    async def get_application_id(db: AsyncSession, account_id: str, conversation_id: str) -> str:
        conversation = (await db.execute(select(ChatConversation).where(
            ChatConversation.AccountId == account_id,
            ChatConversation.Id == conversation_id,
        ).limit(1))).scalar()
        if conversation is None:
            raise SanicException("conversation not found", status_code=404)
        return conversation.ApplicationId

    @staticmethod
    async def exists(db: AsyncSession, account_id: str, conversation_id: str) -> bool:
        """判断指定账号下是否存在某个 conversation_id 的会话记录（用于跨设备/重置场景下补写本地记录）。"""
        if not account_id or not conversation_id:
            return False
        row = (await db.execute(select(ChatConversation.Id).where(
            ChatConversation.AccountId == account_id,
            ChatConversation.Id == conversation_id,
        ).limit(1))).first()
        return row is not None

    @staticmethod
    async def create(
        db: AsyncSession,
        account_id: str,
        application_id: str,
        title: str = "new conversation",
        conversation_id: str = None
    ) -> ChatConversation:
        conversation = ChatConversation(
            AccountId=account_id,
            ApplicationId=application_id,
            Title=title,
            Id=conversation_id
        )
        db.add(conversation)
        await db.commit()
        return conversation

    @staticmethod
    async def get(db: AsyncSession, conversation_id: str) -> ChatConversation:
        conversation = (await db.execute(select(ChatConversation).where(
            ChatConversation.Id == conversation_id
        ).limit(1))).scalar()
        return conversation

    @staticmethod
    async def update(db: AsyncSession, conversation: ChatConversation, title: str = None):
        conversation.LastActiveAt = datetime.now(UTC).replace(tzinfo=None)
        if title is not None:
            conversation.Title = title
        await db.commit()
