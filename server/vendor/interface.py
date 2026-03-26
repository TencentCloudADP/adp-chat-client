"""
ADP Chat Protocol V2 Data Structures and Vendor Interfaces
"""

from enum import Enum
from typing import Protocol, List, Dict, Optional, Any, Union
from pydantic import BaseModel
from sanic.request.types import Request
from sqlalchemy.ext.asyncio import AsyncSession
from model.chat import ChatConversation


NumberLike = Union[int, str, float]


# =============================================================================
# Common Models
# =============================================================================

class ApplicationInfo(BaseModel):
    ApplicationId: str
    Name: str
    Avatar: Optional[str] = None
    Greeting: Optional[str] = None
    OpeningQuestions: List[str] = []


# =============================================================================
# V2 Protocol Data Structures
# =============================================================================

class RecordRole(str, Enum):
    USER = 'user'
    ASSISTANT = 'assistant'


class ContentType(str, Enum):
    TEXT = 'text'
    IMAGE = 'image'
    WIDGET = 'widget'
    FILE = 'file'
    CUSTOM_VARIABLES = 'custom_variables'
    WIDGET_ACTION = 'widget_action'
    JSON_TEXT = 'json_text'


class MessageType(str, Enum):
    """V2 消息类型枚举 / V2 Message type enum

    Attributes:
        REPLY: 回复消息 / Reply message
        THOUGHT: 思考过程消息 / Thought process message
        TOOL_CALL: 工具调用消息 / Tool call message
        TASK_EXECUTION: 任务执行消息 / Task execution message
        RECOMMENDATION: 推荐消息 / Recommendation message
        NOTICE: 通知消息 / Notice message
        QUESTION: 问题消息 / Question message
    """
    REPLY = 'reply'
    THOUGHT = 'thought'
    TOOL_CALL = 'tool_call'
    TASK_EXECUTION = 'task_execution'
    RECOMMENDATION = 'recommendation'
    NOTICE = 'notice'
    QUESTION = 'question'


class EventType(str, Enum):
    """V2 SSE 事件类型枚举 / V2 SSE event type enum

    Attributes:
        REQUEST_ACK: 请求确认 / Request acknowledgment
        RESPONSE_CREATED: 响应创建 / Response created
        RESPONSE_PROCESSING: 响应处理中 / Response processing
        RESPONSE_COMPLETED: 响应完成 / Response completed
        MESSAGE_ADDED: 消息添加 / Message added
        MESSAGE_PROCESSING: 消息处理中 / Message processing
        MESSAGE_DONE: 消息完成 / Message done
        CONTENT_ADDED: 内容添加 / Content added
        TEXT_DELTA: 文本增量 / Text delta
        ERROR: 错误 / Error
        CONVERSATION: 会话事件 / Conversation event
    """
    REQUEST_ACK = 'request_ack'
    RESPONSE_CREATED = 'response.created'
    RESPONSE_PROCESSING = 'response.processing'
    RESPONSE_COMPLETED = 'response.completed'
    MESSAGE_ADDED = 'message.added'
    MESSAGE_PROCESSING = 'message.processing'
    MESSAGE_DONE = 'message.done'
    CONTENT_ADDED = 'content.added'
    TEXT_DELTA = 'text.delta'
    ERROR = 'error'
    CONVERSATION = 'conversation'


# Content-related models

class QuoteInfo(BaseModel):
    Position: int
    Index: int


class DocRefer(BaseModel):
    ReferBizId: str
    DocBizId: str
    DocName: str
    KnowledgeBizId: str
    KnowledgeName: Optional[str] = None
    Url: str


class QaRefer(BaseModel):
    ReferBizId: str
    QaBizId: str
    KnowledgeBizId: str
    KnowledgeName: Optional[str] = None


class WebSearchRefer(BaseModel):
    Url: str


DocReferModel = DocRefer
QaReferModel = QaRefer
WebSearchReferModel = WebSearchRefer


class Reference(BaseModel):
    Index: int
    Type: int
    Name: str
    DocRefer: Optional[DocReferModel] = None
    QaRefer: Optional[QaReferModel] = None
    WebSearchRefer: Optional[WebSearchReferModel] = None


class Sandbox(BaseModel):
    Url: Optional[str] = None
    DisplayUrl: Optional[str] = None
    Content: Optional[str] = None


class WebSearch(BaseModel):
    Content: str


class FileCollection(BaseModel):
    MaxFileCount: int
    SupportedFileTypes: List[str]


class Widget(BaseModel):
    WidgetId: str
    WidgetRunId: str
    State: str
    Position: Optional[int] = None
    EncodedWidget: str
    View: Optional[str] = None
    Payload: Optional[str] = None


SandboxModel = Sandbox
WebSearchModel = WebSearch
FileCollectionModel = FileCollection
WidgetModel = Widget


class Image(BaseModel):
    QuoteInfos: Optional[List[QuoteInfo]] = None
    References: Optional[List[Reference]] = None
    OptionCards: Optional[List[str]] = None
    CustomParams: Optional[List[str]] = None
    Sandbox: Optional[SandboxModel] = None
    WebSearch: Optional[WebSearchModel] = None
    FileCollection: Optional[FileCollectionModel] = None
    RelatedRecordId: Optional[str] = None
    Widget: Optional[WidgetModel] = None


class FileInfo(BaseModel):
    FileName: str
    FileSize: str
    FileUrl: str
    FileType: str
    Url: Optional[str] = None


class WidgetAction(BaseModel):
    WidgetId: str
    WidgetRunId: str
    ActionType: str
    Payload: str
    DocBizId: Optional[str] = None


WidgetActionModel = WidgetAction


class Content(BaseModel):
    Type: ContentType
    Text: Optional[str] = None
    File: Optional[FileInfo] = None
    QuoteInfos: Optional[List[QuoteInfo]] = None
    References: Optional[List[Reference]] = None
    OptionCards: Optional[List[str]] = None
    CustomParams: Optional[List[str]] = None
    Sandbox: Optional[SandboxModel] = None
    WebSearch: Optional[WebSearchModel] = None
    FileCollection: Optional[FileCollectionModel] = None
    RelatedRecordId: Optional[str] = None
    Widget: Optional[WidgetModel] = None
    CustomVariables: Optional[Dict[str, str]] = None
    WidgetAction: Optional[WidgetActionModel] = None


def extract_text_from_contents(contents: Optional[List[Union["Content", Dict[str, Any]]]]) -> str:
    if not contents:
        return ""
    for item in contents:
        if item is None:
            continue
        if isinstance(item, Content):
            content_type = item.Type
            text = item.Text
        elif isinstance(item, dict):
            content_type = item.get("Type") or item.get("type")
            text = item.get("Text") or item.get("text")
        else:
            content_type = getattr(item, "Type", None)
            text = getattr(item, "Text", None)

        if content_type in {ContentType.TEXT, ContentType.JSON_TEXT, "text", "json_text"} and text:
            return text
    return ""


# Message-related models

class MessageExtraInfo(BaseModel):
    Elapsed: Optional[NumberLike] = None
    StartTime: Optional[NumberLike] = None
    AgentName: Optional[str] = None
    AgentIcon: Optional[str] = None
    ToolName: Optional[str] = None
    ToolIcon: Optional[str] = None


class Message(BaseModel):
    Type: MessageType
    MessageId: str
    Name: str
    Title: str
    Icon: Optional[str] = None
    Status: str
    StatusDesc: Optional[str] = None
    Contents: Optional[List[Content]] = None
    ExtraInfo: Optional[MessageExtraInfo] = None


# Procedure-related models

class History(BaseModel):
    Assistant: Optional[str] = None
    User: Optional[str] = None


class KnowledgeOutput(BaseModel):
    Type: int
    Content: str


class Knowledge(BaseModel):
    Content: str
    System: Optional[str] = None
    RewriteQuery: Optional[str] = None
    CustomVariables: Optional[List[str]] = None
    Histories: Optional[List[History]] = None
    Outputs: Optional[List[KnowledgeOutput]] = None


class OptionCardIndex(BaseModel):
    RecordId: str
    Index: int


OptionCardIndexModel = OptionCardIndex


class RunNode(BaseModel):
    Elapsed: str
    NodeId: str
    NodeName: str
    NodeType: int


class WorkflowProcedure(BaseModel):
    WorkflowId: str
    WorkflowName: str
    WorkflowReleaseTime: str
    WorkflowRunId: str
    Content: str
    Outputs: List[str]
    OptionCardIndex: Optional[OptionCardIndexModel] = None
    OptionCards: Optional[List[str]] = None
    RunNodes: Optional[List[RunNode]] = None


class StatInfo(BaseModel):
    Elapsed: Optional[NumberLike] = None
    StartTime: Optional[NumberLike] = None
    InputTokens: Optional[NumberLike] = None
    OutputTokens: Optional[NumberLike] = None
    TotalTokens: Optional[NumberLike] = None
    ModelName: Optional[str] = None
    Input: Optional[str] = None
    Output: Optional[str] = None
    Content: Optional[str] = None
    System: Optional[str] = None
    RewriteQuery: Optional[str] = None
    CustomVariables: Optional[List[str]] = None
    FirstTokenCost: Optional[NumberLike] = None
    TotalCost: Optional[NumberLike] = None


class Agent(BaseModel):
    Status: int
    Input: Optional[str] = None
    InputRef: Optional[str] = None
    Output: Optional[str] = None
    OutputRef: Optional[str] = None
    TaskOutput: Optional[str] = None
    TaskOutputRef: Optional[str] = None
    Reply: Optional[str] = None
    FailCode: Optional[str] = None
    FailMessage: Optional[str] = None
    BelongNodeId: Optional[str] = None
    IsCurrent: Optional[bool] = None
    StatInfos: Optional[List[StatInfo]] = None
    ModelName: Optional[str] = None
    Content: Optional[str] = None
    System: Optional[str] = None
    RewriteQuery: Optional[str] = None
    CustomVariables: Optional[List[str]] = None


KnowledgeModel = Knowledge
AgentModel = Agent


class Procedure(BaseModel):
    ParentMessageId: Optional[str] = None
    Name: str
    Title: str
    Status: str
    IntentCate: Optional[str] = None
    ResourceStatus: Optional[int] = None
    Type: str
    Knowledge: Optional[KnowledgeModel] = None
    Workflow: Optional[WorkflowProcedure] = None
    Agent: Optional[AgentModel] = None
    StatInfos: Optional[List[StatInfo]] = None


# Record-related models

class RecordExtraInfo(BaseModel):
    RequestId: Optional[str] = None
    TraceId: Optional[str] = None
    Elapsed: Optional[NumberLike] = None
    StartTime: Optional[NumberLike] = None
    IsFromSelf: Optional[bool] = None
    IsLlmGenerated: Optional[bool] = None
    CanRating: Optional[bool] = None
    CanFeedback: Optional[bool] = None
    ReplyMethod: Optional[int] = None
    FromName: Optional[str] = None
    FromAvatar: Optional[str] = None
    HasRead: Optional[bool] = None


StatInfoModel = StatInfo


class Record(BaseModel):
    Role: RecordRole
    RecordId: str
    RelatedRecordId: Optional[str] = None
    ConversationId: str
    Status: str
    StatusDesc: Optional[str] = None
    Messages: Optional[List[Message]] = None
    Procedures: Optional[List[Procedure]] = None
    StatInfo: Optional[StatInfoModel] = None
    ExtraInfo: Optional[RecordExtraInfo] = None


class ErrorInfo(BaseModel):
    Code: int
    Message: str
    RequestId: Optional[str] = None
    TraceId: Optional[str] = None
    Elapsed: Optional[NumberLike] = None
    StartTime: Optional[NumberLike] = None

# =============================================================================
# Vendor Interfaces
# =============================================================================

class ConversationCallback(Protocol):
    async def create(
        self,
        title: str = None,
        vendor_conversation_id: str = None
    ) -> ChatConversation:
        """创建会话回调函数，参数：
        - title: str                   # 会话标题(选填)
        - vendor_conversation_id: str  # 供应商会话ID(选填)
        return: ChatConversation       # 返回会话对象
        """
        pass

    async def update(
        self,
        conversation_id: str = None,
        title: str = None,
        vendor_conversation_id: str = None
    ) -> ChatConversation:
        """更新会话回调函数，参数：
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
    async def chat(
        self,
        account_id: str,
        contents: List[Content],
        conversation_id: str,
        is_new_conversation: bool,
        conversation_cb: ConversationCallback,
        search_network=True,
        custom_variables={}
    ):
        """执行聊天对话处理（异步方法）

        核心聊天交互接口，处理用户查询并实时返回对话结果。

        Args:
            account_id (str): 用户账户唯一标识，用于标识不同用户
            contents (List[Content]): 用户输入内容列表，遵循 Content 结构
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
    async def get_messages(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        limit: int, last_record_id: str = None
    ) -> list[Record]:
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
            list[Record]: V2协议消息记录列表，按时间升序排列
        """
        raise NotImplementedError("Subclasses must implement this method")


class FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str, mime_type: str) -> str:
        """异步上传文件

        Args:
            db (AsyncSession): SQLAlchemy db连接对象
            request (Request): 请求对象（流式读取：await request.stream.read()）
            account_id (str): 账户唯一标识符
            mime_type (str, optional): 文件类型

        Returns:
            url (str): 文件Url
        """
        raise NotImplementedError("Subclasses must implement this method")


class ReferenceInterface:
    async def get_reference_details(
        self,
        account_id: Optional[str],
        reference_ids: List[str],
    ) -> List[Dict[str, Any]]:
        """批量获取引用详情

        用于补充引用切片等详情数据，前端可基于该接口做统一 hydration

        Args:
            account_id (Optional[str]): 当前账户ID。某些无登录场景（如分享页）可为空
            reference_ids (List[str]): 引用ID列表

        Returns:
            List[Dict[str, Any]]: 按引用ID返回的详情列表
        """
        raise NotImplementedError("Subclasses must implement this method")


class FeedbackInterface:
    async def rate(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        record_id: str, score: int,
        comment: str = None
    ) -> None:
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


class BaseVendor(ChatInterface, MessageInterface, FileInterface, ReferenceInterface, FeedbackInterface, ApplicationInterface):
    """厂商基类，实现具体的厂商接口需要从该类继承
    """
    def __init__(self, config: dict = {}, application_id: str = ''):
        super().__init__()
        self.config = config
        self.application_id = application_id
