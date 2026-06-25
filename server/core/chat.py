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
            return name or customer_id or account_id
        return customer_id or account_id

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
                        # 本地不存在则补写一条记录（兼容跨设备 / 本地数据被清理 / 直接传 vendor 侧 conversation_id 等场景）
                        logger.info(
                            "[CoreChat.message] conversation %s missing on update, auto-create for account %s",
                            conversation_id, account_id,
                        )
                        return await CoreConversation.create(
                            db,
                            account_id,
                            vendor_app.application_id,
                            title=title or title_source[:10],
                            conversation_id=conversation_id,
                        )
                    await CoreConversation.update(db, conversation, title=title)
                    return conversation

        # 判断是否为新会话：
        # 1) 前端未传 / 传空 ConversationId  -> 视为新会话，由 vendor 触发 create
        # 2) 前端传了 ConversationId 但本地 DB 不存在该 (account_id, conversation_id) -> 也视为新会话，
        #    需要补写一条记录（跨设备 / 本地 DB 被清理 / 用户从 vendor 侧拿到 ConversationId 等场景），
        #    并把已有 conversation_id 透传给 create，避免 DB 自动生成新 UUID 与 vendor 端不一致。
        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            is_new_conversation = True
        else:
            async with db_connection() as db:
                if not await CoreConversation.exists(db, account_id, conversation_id):
                    logger.info(
                        "[CoreChat.message] conversation %s not in local DB for account %s, will create",
                        conversation_id, account_id,
                    )
                    await CoreConversation.create(
                        db,
                        account_id,
                        vendor_app.application_id,
                        title=title_source[:10],
                        conversation_id=conversation_id,
                    )
                    # 已经在 DB 中创建，无需 vendor 再触发 create 回调；保持 is_new_conversation=False
                    # 让 vendor 走"已有会话继续对话"的分支。

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
