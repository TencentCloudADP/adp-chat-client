from typing import Protocol, Any
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from model.chat import ChatRecord, ChatConversation

class ApplicationInfo(BaseModel):
    ApplicationId: str
    Name: str
    Avatar: str = ''
    Greeting: str = ''
    OpeningQuestions: list[str] = []

class ConversationCallback(Protocol):
    async def create(self, title: str = None, vendor_conversation_id: str = None) -> str:
        """更新会话回调函数，参数：
        - title: str                   # 会话标题(选填)
        - vendor_conversation_id: str  # 供应商会话ID(选填)
        return: conversation_id: str   # 返回会话ID
        """
        pass
    async def update(self, conversation_id: str = None, title: str = None, vendor_conversation_id: str = None) -> ChatConversation:
        """创建会话回调函数，参数：
        - conversation_id: str         # 会话ID
        - title: str                   # 会话标题(选填)
        - vendor_conversation_id: str  # 供应商会话ID(选填)
        return: conversation_id: str   # 返回会话ID
        """
        pass

class ApplicationInterface:
    @classmethod
    def get_config_prefix(self) -> str:
        pass

    async def get_info(self) -> ApplicationInfo:
        pass

class ChatInterface:
    async def chat(self, account_id: str, query: str, conversation_id: str, is_new_conversation: bool, conversation_cb: ConversationCallback, search_network = True, custom_variables = {}):
        pass

class MessageInterface:
    async def get_messages(self, db: AsyncSession, account_id: str, conversation_id: str, last_record_id: str = None) -> list:
        pass

class BaseVendor(ChatInterface, MessageInterface, ApplicationInterface):
    def __init__(self, config: dict = {}, application_id: str = ''):
        super().__init__()
        self.config = config
        self.application_id = application_id
