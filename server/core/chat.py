import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config import tagentic_config
from core.account import CoreAccount
from core.conversation import CoreConversation
from model.chat import ChatRecord, ChatConversation
from vendor.interface import BaseVendor, ConversationCallback, extract_text_from_contents
from util.database import db_connection

logger = logging.getLogger(__name__)


class CoreChat:
    @staticmethod
    async def resolve_vendor_account_id(account_id: str) -> str:
        async with db_connection() as db:
            account = await CoreAccount.get(db, account_id)
            account_third_party = await CoreAccount.get_third_party(db, account_id)

        customer_id = (
            account_third_party.OpenId
            if account_third_party
            else str(account.Id if account else account_id)
        )
        name = account.Name if account else ""

        if tagentic_config.ADP_VISITOR_ID_TYPE == "NAME":
            return name
        return customer_id

    @staticmethod
    async def message(
        vendor_app: BaseVendor,
        account_id: str,
        contents: list,
        conversation_id: str,
        search_network: bool,
        custom_variables: dict,
    ):
        title_source = extract_text_from_contents(contents).strip()
        if not title_source:
            title_source = "New Chat"

        class CoreConversationCallback(ConversationCallback):
            async def create(self, title: str = None, conversation_id: str = None) -> ChatConversation:
                # create
                if title is None:
                    title = title_source[:10]
                async with db_connection() as db:
                    conversation = await CoreConversation.create(
                        db,
                        account_id,
                        vendor_app.application_id,
                        title=title,
                        conversation_id=conversation_id
                    )
                    return conversation

            async def update(self, conversation_id: str = None, title: str = None) -> ChatConversation:
                # update
                async with db_connection() as db:
                    conversation = await CoreConversation.get(db, conversation_id)
                    if conversation is None:
                        raise Exception(f'conversation not found: {conversation_id}')
                    await CoreConversation.update(db, conversation, title=title)
                    return conversation

        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            is_new_conversation = True

        vendor_account_id = await CoreChat.resolve_vendor_account_id(account_id)
        async for message in vendor_app.chat(
            vendor_account_id,
            contents,
            conversation_id,
            is_new_conversation,
            CoreConversationCallback(),
            search_network=search_network,
            custom_variables=custom_variables
        ):
            yield message


class CoreMessage:
    @staticmethod
    async def list(db: AsyncSession, conversation_id: str) -> list[ChatRecord]:
        conversations = (await db.execute(select(ChatRecord).where(
            ChatRecord.ConversationId == conversation_id
        ).order_by(ChatRecord.CreatedAt))).scalars()
        return conversations

    @staticmethod
    async def create(db: AsyncSession, conversation_id: str, from_role: str, content: str) -> ChatRecord:
        message = ChatRecord(ConversationId=conversation_id, FromRole=from_role, Content=content)
        db.add(message)
        await db.commit()
        return message
