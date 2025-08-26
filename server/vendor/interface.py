from enum import Enum
from typing import Protocol, List, Dict, Optional, TypedDict, Union, Any
from pydantic import BaseModel
from sanic.request.types import Request
from sqlalchemy.ext.asyncio import AsyncSession
from model.chat import ChatRecord, ChatConversation

class ApplicationInfo(BaseModel):
    ApplicationId: str
    Name: str
    Avatar: Optional[str] = None
    Greeting: Optional[str] = None
    OpeningQuestions: List[str] = []

class _Debugging(BaseModel):
    CustomVariables: Optional[List[Any]] = None
    Histories: Optional[List[Any]] = None
    Knowledge: Optional[List[Any]] = None
    System: Optional[str] = None
    TaskFlow: Optional[Dict[str, Any]] = None
    WorkFlow: Optional[Dict[str, Any]] = None
    Agent: Optional[Dict[str, str]] = None
    Content: Optional[str] = None

class _Procedure(BaseModel):
    Count: Optional[int] = None
    Debugging: Optional[_Debugging] = None
    Name: Optional[str] = None
    ResourceStatus: Optional[int] = None
    Status: Optional[str] = None
    Title: Optional[str] = None

class _TokenStat(BaseModel):
    FreeCount: Optional[int] = None
    Procedures: Optional[List[_Procedure]] = None
    RequestId: Optional[str] = None
    StatusSummary: Optional[str] = None
    StatusSummaryTitle: Optional[str] = None
    TokenCount: Optional[int] = None
    Elapsed: Optional[int] = None
    OrderCount: Optional[int] = None
    RecordId: Optional[str] = None
    SessionId: Optional[str] = None
    TraceId: Optional[str] = None
    UsedCount: Optional[int] = None

class _WorkFlow(BaseModel):
    WorkflowReleaseTime: Optional[str] = None
    WorkflowRunId: Optional[str] = None
    OptionCards: Optional[List[Any]] = None
    Outputs: Optional[List[Any]] = None
    WorkflowId: Optional[str] = None
    WorkflowName: Optional[str] = None

class _ExtraInfo(BaseModel):
    EChartsInfo: Optional[List[Any]] = None

class _DebuggingThought(BaseModel):
    Content: Optional[str] = None
    DisplayStatus: Optional[str] = None
    QuoteInfos: Optional[List[Any]] = None
    References: Optional[List[Any]] = None
    SandboxUrl: Optional[str] = None
    DisplayContent: Optional[str] = None
    DisplayThought: Optional[str] = None
    DisplayType: Optional[int] = None
    DisplayUrl: Optional[str] = None

class _ProcedureThought(BaseModel):
    Index: Optional[int] = None
    PluginType: Optional[int] = None
    Debugging: Optional[_DebuggingThought] = None
    ReplyIndex: Optional[int] = None
    SourceAgentName: Optional[str] = None
    Status: Optional[str] = None
    WorkflowName: Optional[str] = None
    Elapsed: Optional[int] = None
    Name: Optional[str] = None
    Switch: Optional[str] = None
    TargetAgentName: Optional[str] = None
    Title: Optional[str] = None
    AgentIcon: Optional[str] = None
    Icon: Optional[str] = None
    NodeName: Optional[str] = None
    StartTime: Optional[str] = None

class _AgentThought(BaseModel):
    Files: Optional[List[Any]] = None
    IsWorkflow: Optional[bool] = None
    Procedures: Optional[List[_ProcedureThought]] = None
    RequestId: Optional[str] = None
    Elapsed: Optional[int] = None
    RecordId: Optional[str] = None
    SessionId: Optional[str] = None
    TraceId: Optional[str] = None
    WorkflowName: Optional[str] = None

class MsgRecord(BaseModel):
    Content: Optional[str] = None
    Type: Optional[int] = None
    IsLlmGenerated: Optional[bool] = None
    QuoteInfos: Optional[List[Any]] = None
    Score: Optional[int] = None
    FileInfos: Optional[List[Any]] = None
    FromAvatar: Optional[str] = None
    HasRead: Optional[bool] = None
    IsFromSelf: Optional[bool] = None
    IsFinal: Optional[bool] = None
    CanRating: Optional[bool] = None
    Timestamp: Optional[int] = None
    CanFeedback: Optional[bool] = None
    SessionId: Optional[str] = None
    WorkFlow: Optional[_WorkFlow] = None
    ImageUrls: Optional[List[str]] = None
    Reasons: Optional[List[Any]] = None
    TaskFlow: Optional[Any] = None
    TokenStat: Optional[_TokenStat] = None
    ExtraInfo: Optional[_ExtraInfo] = None
    RelatedRecordId: Optional[str] = None
    AgentPlan: Optional[Any] = None
    RecordId: Optional[str] = None
    FromName: Optional[str] = None
    OptionCards: Optional[List[Any]] = None
    ReplyMethod: Optional[int] = None
    AgentThought: Optional[_AgentThought] = None
    References: Optional[List[Any]] = None

class MessageType(Enum):
    """消息类型枚举，用于标识消息的性质 / Message type enum for categorizing message purposes
    
    Attributes:
        REPLY: 回复消息 / Reply message (direct response to user)
        THOUGHT: 思考过程消息 / Thought process message
        REFERENCE: 引用消息 / Reference material
        TOKEN_STAT: Token统计消息 / Token usage statistics
        ERROR: 错误消息 / Error notification
        CONVERSATION: 会话级别消息 / Conversation-level notification
    """
    
    REPLY = 'reply'
    """回复消息（直接返回给用户的内容） / Reply message (direct response to user)"""
    
    THOUGHT = 'thought'
    """思考过程消息（展示在"思考中"的内容） / Thought process message (showing intermediate reasoning)"""

    REFERENCE = 'reference'
    """引用消息（提供参考来源） / Reference material (providing sources)"""

    TOKEN_STAT = 'token_stat'
    """Token统计消息（显示Token使用情况） / Token usage statistics (showing consumption)"""
    
    ERROR = 'error'
    """错误消息（错误提示） / Error notification (error message)"""

    CONVERSATION = 'conversation'
    """会话级别消息（用于通知新会话ID、更新会话摘要等） / Conversation-level notification (new session ID, summary updates etc.)"""

    def __str__(self):
        return self.value

class ConversationCallback(Protocol):
    async def create(self, title: str = None, vendor_conversation_id: str = None) -> ChatConversation:
        """更新会话回调函数，参数：
        - title: str                   # 会话标题(选填)
        - vendor_conversation_id: str  # 供应商会话ID(选填)
        return: ChatConversation       # 返回会话对象
        """
        pass
    async def update(self, conversation_id: str = None, title: str = None, vendor_conversation_id: str = None) -> ChatConversation:
        """创建会话回调函数，参数：
        - conversation_id: str         # 会话ID
        - title: str                   # 会话标题(选填)
        - vendor_conversation_id: str  # 供应商会话ID(选填)
        return: ChatConversation       # 返回会话对象
        """
        pass

class ApplicationInterface:
    """应用相关接口"""
    
    @classmethod
    def get_vendor(cls) -> str:
        """获取应用配置标识
        
        当.env中APP_CONFIGS的Vendor字段与此方法返回值一致时，匹配该厂商接口
        
        Returns:
            str: 例如："TCADP"
        """
        raise NotImplementedError("Subclasses must implement this method")

    async def get_info(self) -> ApplicationInfo:
        """异步获取应用信息
        
        该方法返回应用的核心元数据，参考数据结构ApplicationInfo
        
        Returns:
            ApplicationInfo: 包含应用信息的结构化对象
            
        Raises:
            RuntimeError: 当应用信息不可获取时抛出
            NotImplementedError: 必须由子类实现具体逻辑
        """
        raise NotImplementedError("Subclasses must implement this method")

class ChatInterface:
    async def chat(self, db: AsyncSession, account_id: str, query: str, conversation_id: str, is_new_conversation: bool, conversation_cb: ConversationCallback, search_network = True, custom_variables = {}):
        """执行聊天对话处理（异步方法）

        核心聊天交互接口，处理用户查询并实时返回对话结果。

        Args:
            db (AsyncSession): SQLAlchemy db连接对象
            account_id (str): 用户账户唯一标识，用于标识不同用户
            query (str): 用户输入的查询文本
            conversation_id (str): 对话会话唯一标识
                如果是新会话，conversation_id为None
            is_new_conversation (bool): 是否为新对话的标志
            conversation_cb (ConversationCallback): 对话回调接口
                用于创建和更新会话。
                如果厂商服务会自动生成新会话Id，那么获取到新的会话Id后，需要调用conversation_cb.create(title, vendor_conversation_id)，将厂商生成的会话Id告知本系统
                多轮对话，需要调用conversation_cb.update(conversation_id, ...)更新最后活跃时间和其他信息，可选更新：title(会话标题)
            search_network (bool, optional): 是否启用网络搜索增强
                默认值: True (当查询需要实时数据时自动触发搜索)
            custom_variables (dict, optional): 自定义上下文变量
                示例: {"user_level": "VIP"}

        Returns:
            None: 结果通过 yield 进行流式多次返回
        """
        raise NotImplementedError("Subclasses must implement this method")

class MessageInterface:
    async def get_messages(self, db: AsyncSession, account_id: str, conversation_id: str, limit: int, last_record_id: str = None) -> list[MsgRecord]:
        """异步获取指定对话的消息记录

        通过厂商接口，或本系统数据库查询特定会话的消息记录，支持通过last_record_id分页查询

        Args:
            db (AsyncSession): SQLAlchemy db连接对象
            account_id (str): 账户唯一标识符
            conversation_id (str): 对话唯一标识
            limit (int): 拉取消息数量
            last_record_id (str, optional): 分页拉取，从这条消息的后一条开始拉
                如果提供，则只返回比该id更老的消息，否则返回最新消息
                默认值: None (返回最新消息)

        Returns:
            list[MsgRecord]: 消息对象列表，按时间升序排列
        """
        raise NotImplementedError("Subclasses must implement this method")

class FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str) -> str:
        """异步上传文件
        
        Args:
            db (AsyncSession): SQLAlchemy db连接对象
            request (Request): 请求对象（流式读取：await request.stream.read()）
            account_id (str): 账户唯一标识符
            type (str, optional): 文件类型
            
        Returns:
            url (str): 文件Url
        """
        raise NotImplementedError("Subclasses must implement this method")

class FeedbackInterface:
    async def rate(self, db: AsyncSession, account_id: str, conversation_id: str, record_id: str, score: int, comment: str = None) -> None:
        """异步反馈消息评分
        
        Args:
            db (AsyncSession): SQLAlchemy db连接对象
            account_id (str): 账户唯一标识符
            conversation_id (str): 对话唯一标识
            record_id (str): 消息记录唯一标识
            score (int): 评分值，0: 撤销，1: 赞，2: 踩
            comment (str): 反馈评论
            
        Returns:
            None
        """
        raise NotImplementedError("Subclasses must implement this method")

class BaseVendor(ChatInterface, MessageInterface, FileInterface, FeedbackInterface, ApplicationInterface):
    """厂商基类，实现具体的厂商接口需要从该类继承
    """
    def __init__(self, config: dict = {}, application_id: str = ''):
        super().__init__()
        self.config = config
        self.application_id = application_id
