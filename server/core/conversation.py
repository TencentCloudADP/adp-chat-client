from datetime import UTC, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from model.chat import ChatConversation


class CoreConversation:
    @staticmethod
    async def list(db: AsyncSession, account_id: str) -> list[ChatConversation]:
        conversations = (await db.execute(select(ChatConversation).where(
            ChatConversation.AccountId == account_id
        ).order_by(desc(ChatConversation.LastActiveAt)))).scalars()
        return conversations

    @staticmethod
    async def get_application_id(db: AsyncSession, account_id: str, conversation_id: str) -> str:
        conversation = (await db.execute(select(ChatConversation).where(
            ChatConversation.AccountId == account_id,
            ChatConversation.Id == conversation_id,
        ).limit(1))).scalar()
        if conversation is None:
            raise Exception("conversation not found")
        return conversation.ApplicationId

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
