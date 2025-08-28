from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.chat import SharedConversation


class CoreShareConversation:

    @staticmethod
    async def create(
        db: AsyncSession, account_id: str, conversation_id: str, application_id: str, records: list
    ) -> SharedConversation:
        shared = SharedConversation(
            AccountId=account_id, ApplicationId=application_id, ParentConversationId=conversation_id, Records=records
        )
        db.add(shared)
        await db.commit()

        return shared

    @staticmethod
    async def list(db: AsyncSession, share_id: str) -> SharedConversation:
        records = (await db.execute(
            select(SharedConversation)
            .where(
                SharedConversation.Id == share_id
            )
            .limit(1)
        )).scalar()
        return records
