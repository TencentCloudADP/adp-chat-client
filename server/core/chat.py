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
    # 通用占位名，不足以唯一标识用户，NAME 模式下需退回 customer_id 兜底，
    # 避免 AUTO_CREATE_ACCOUNT 场景下所有自动账号共享同一 VisitorId。
    _GENERIC_ACCOUNT_NAMES = frozenset({"", "user", "anonymous", "guest"})

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
            # 仅当 name 具备可区分性时才用它；否则退回 customer_id / account_id，
            # 防止不同账号被 vendor 侧视为同一访客（多轮上下文、限流、统计串号）。
            if name and name.strip().lower() not in CoreChat._GENERIC_ACCOUNT_NAMES:
                return name
            return customer_id or account_id
        return customer_id or account_id

    @staticmethod
    async def message(
        vendor_app: BaseVendor,
        account_id: str,
        contents: list,
        conversation_id: str,
        search_network: bool,
        custom_variables: dict,
        is_channel: bool = False,
    ):
        """
        发送聊天消息。

        is_channel:
            标识本次会话是否为"渠道会话"（企微 / 微信 Bot 等，vendor 侧已存在的会话）。
            渠道会话的权威数据源在 vendor 侧（CAPI DescribeConversationList），
            不应在本地 chat_conversation 表落地，否则会污染 /chat/conversations 侧栏列表
            （用户点渠道 → 发送 → 侧栏冒出一条"新对话"）。
            规则：
              - is_channel=True 时，callback.create/update 若发现本地不存在该会话，
                跳过 DB 写入，返回一个仅带 Id/Title 的临时 ChatConversation 实例
                供 vendor 层与 SSE conversation 事件使用；
              - is_channel=True 时，入口预检也不再补写本地记录。
              - 若渠道会话恰巧已存在于本地 DB（历史脏数据），update 仍走正常更新分支，
                但不会新增，语义安全。
        """
        title_source = extract_text_from_contents(contents).strip()
        if not title_source:
            title_source = "New Chat"

        def _make_transient_conversation(cid: str, title: str) -> ChatConversation:
            """构造一个未持久化的 ChatConversation 供渠道场景返回给 vendor / SSE payload 使用。

            仅设置 Id / AccountId / ApplicationId / Title，不 add 到 session，也不 commit，
            因此不会写入本地 chat_conversation 表。带 _sa_instance_state 以便 to_dict() 正常。
            """
            return ChatConversation(
                Id=cid,
                AccountId=account_id,
                ApplicationId=vendor_app.application_id,
                Title=title,
            )

        class CoreConversationCallback(ConversationCallback):
            async def create(self, title: str = None, conversation_id: str = None) -> ChatConversation:
                # create
                if title is None:
                    title = title_source[:10]
                # 渠道会话：不落地本地 DB，返回临时对象即可（vendor 只用 .Id）
                if is_channel:
                    logger.info(
                        "[CoreChat.message] skip local create for channel conversation %s (account %s)",
                        conversation_id, account_id,
                    )
                    return _make_transient_conversation(conversation_id, title)
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
                        # 渠道会话：本地不存在属于预期（vendor 侧才是权威数据源），不补写，
                        # 返回临时对象即可（vendor 仅用其 Id / SSE payload 展示）。
                        if is_channel:
                            logger.info(
                                "[CoreChat.message] skip local upsert for channel conversation %s (account %s)",
                                conversation_id, account_id,
                            )
                            return _make_transient_conversation(
                                conversation_id, title or title_source[:10]
                            )
                        # 非渠道会话本地不存在：补写一条记录（兼容跨设备 / 本地数据被清理 /
                        # 直接传 vendor 侧 conversation_id 等场景）
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
                    # 已存在（含"渠道会话恰有历史脏数据落到本地"的情况）：正常更新，
                    # 不会新增 → 语义安全
                    await CoreConversation.update(db, conversation, title=title)
                    return conversation

        # 判断是否为新会话：
        # 1) 前端未传 / 传空 ConversationId  -> 视为新会话，由 vendor 触发 create
        # 2) 前端传了 ConversationId 但本地 DB 不存在该 (account_id, conversation_id) -> 也视为新会话，
        #    需要补写一条记录（跨设备 / 本地 DB 被清理 / 用户从 vendor 侧拿到 ConversationId 等场景），
        #    并把已有 conversation_id 透传给 create，避免 DB 自动生成新 UUID 与 vendor 端不一致。
        # 3) 渠道会话（is_channel=True）：conversation_id 一定由前端传入（来自 CAPI 拉取到的
        #    vendor 侧渠道会话 Id），本地不存在属于预期 → 不补写，直接以"已有会话继续对话"进入 vendor。
        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            if is_channel:
                # 渠道会话必须携带既有 ConversationId，否则语义错误
                raise ValueError("channel conversation requires an existing ConversationId")
            is_new_conversation = True
        elif not is_channel:
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
