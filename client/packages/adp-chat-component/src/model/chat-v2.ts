/**
 * ADP chat protocol v2 data structures.
 */

export type NumberLike = number | string

export type RecordRole = 'user' | 'assistant'

export type ContentType =
  | 'text'
  | 'image'
  | 'widget'
  | 'file'
  | 'custom_variables'
  | 'widget_action'
  | 'json_text'

export type MessageType =
  | 'reply'
  | 'thought'
  | 'tool_call'
  | 'task_execution'
  | 'recommendation'
  | 'notice'
  | 'question'

export interface Content {
  Type: ContentType
  Text?: string
  File?: FileInfo
  QuoteInfos?: QuoteInfo[]
  References?: Reference[]
  OptionCards?: string[]
  CustomParams?: string[]
  Sandbox?: Sandbox
  WebSearch?: WebSearch
  FileCollection?: FileCollection
  RelatedRecordId?: string
  Widget?: Widget
  CustomVariables?: { [key: string]: string }
  WidgetAction?: WidgetAction
}

export interface Image {
  QuoteInfos?: QuoteInfo[]
  References?: Reference[]
  OptionCards?: string[]
  CustomParams?: string[]
  Sandbox?: Sandbox
  WebSearch?: WebSearch
  FileCollection?: FileCollection
  RelatedRecordId?: string
  Widget?: Widget
}

export interface FileInfo {
  FileName: string
  FileSize: string
  FileUrl: string
  FileType: string
  Url?: string
}

export interface WidgetAction {
  WidgetId: string
  WidgetRunId: string
  ActionType: string
  Payload: string
  DocBizId?: string
}

export interface Widget {
  WidgetId: string
  WidgetRunId: string
  State: string
  Position?: number
  EncodedWidget: string
  View?: string
  Payload?: string
}

export interface QuoteInfo {
  Position: number
  Index: number
}

export interface Reference {
  Index?: number
  Type?: number
  Name?: string
  Id?: string
  Url?: string
  DocBizId?: string
  QaBizId?: string
  ReferBizId?: string
  DocName?: string
  KnowledgeBizId?: string
  KnowledgeName?: string
  PageContent?: string
  OrgData?: string
  PageInfos?: number[]
  SheetInfos?: string[]
  DocType?: number
  Status?: string
  DocRefer?: DocRefer
  QaRefer?: QaRefer
  WebSearchRefer?: WebSearchRefer
}

export interface DocRefer {
  ReferBizId: string
  DocBizId: string
  DocId?: string
  DocName: string
  KnowledgeBizId: string
  KnowledgeId?: string
  KnowledgeName?: string
  ReferenceId?: string
  Url: string
}

export interface QaRefer {
  ReferBizId: string
  QaBizId: string
  KnowledgeBizId: string
  KnowledgeName?: string
}

export interface WebSearchRefer {
  Url: string
}

export interface Sandbox {
  Url?: string
  DisplayUrl?: string
  Content?: string
}

export interface WebSearch {
  Content: string
}

export interface FileCollection {
  MaxFileCount: number
  SupportedFileTypes: string[]
}

/** 聊天会话信息 */
export interface ChatConversation {
  Id: string
  AccountId: string
  Title: string
  LastActiveAt: number
  CreatedAt: number
  ApplicationId: string
}

/** 聊天会话请求参数 */
export interface ChatConversationProps {
  ConversationId?: string
  ShareId?: string
  LastRecordId?: string
}

/** 消息评分值枚举 */
export const ScoreValue = {
  Unknown: 0,
  Like: 1,
  Dislike: 2,
} as const
export type ScoreValue = typeof ScoreValue[keyof typeof ScoreValue]

export interface Record {
  Role: RecordRole
  RecordId: string
  RelatedRecordId?: string
  ConversationId: string
  Status: string
  StatusDesc: string
  Messages?: Message[]
  Procedures?: Procedure[]
  StatInfo?: StatInfo
  ExtraInfo?: RecordExtraInfo
  Score?: ScoreValue
}

export interface RecordExtraInfo {
  RequestId: string
  TraceId: string
  Elapsed: NumberLike
  StartTime: NumberLike
  IsFromSelf: boolean
  IsLlmGenerated?: boolean
  CanRating?: boolean
  CanFeedback?: boolean | null
  ReplyMethod?: number
  FromName?: string
  FromAvatar?: string
  HasRead?: boolean
}

export interface Message {
  Type: MessageType
  MessageId: string
  Name: string
  Title: string
  Icon?: string
  Status: string
  StatusDesc?: string
  Contents?: Content[]
  ExtraInfo?: MessageExtraInfo
}

export interface MessageExtraInfo {
  Elapsed: NumberLike
  StartTime: NumberLike
  AgentName?: string
  AgentIcon?: string
  ToolName?: string
  ToolIcon?: string
}

export interface Procedure {
  ParentMessageId?: string
  Name: string
  Title: string
  Status: string
  IntentCate?: string
  ResourceStatus?: number
  Type: string
  Knowledge?: Knowledge
  Workflow?: WorkflowProcedure
  Agent?: Agent
  StatInfos?: StatInfo[]
}

export interface Knowledge {
  Content: string
  System?: string
  RewriteQuery?: string
  CustomVariables?: string[]
  Histories?: History[]
  Outputs?: KnowledgeOutput[]
}

export interface History {
  Assistant?: string
  User?: string
}

export interface KnowledgeOutput {
  Type: number
  Content: string
}

export interface WorkflowProcedure {
  WorkflowId: string
  WorkflowName: string
  WorkflowReleaseTime: string
  WorkflowRunId: string
  Content: string
  Outputs: string[]
  OptionCardIndex?: OptionCardIndex
  OptionCards?: string[]
  RunNodes?: RunNode[]
}

export interface OptionCardIndex {
  RecordId: string
  Index: number
}

export interface RunNode {
  Elapsed: string
  NodeId: string
  NodeName: string
  NodeType: number
}

export interface Agent {
  Status: number
  Input?: string
  InputRef?: string
  Output?: string
  OutputRef?: string
  TaskOutput?: string
  TaskOutputRef?: string
  Reply?: string
  FailCode?: string
  FailMessage?: string
  BelongNodeId?: string
  IsCurrent?: boolean
  StatInfos?: StatInfo[]
  ModelName?: string
  Content?: string
  System?: string
  RewriteQuery?: string
  CustomVariables?: string[]
}

export interface StatInfo {
  Elapsed?: NumberLike
  StartTime?: NumberLike
  InputTokens?: NumberLike
  OutputTokens?: NumberLike
  TotalTokens?: NumberLike
  ModelName?: string
  Input?: string
  Output?: string
  Content?: string
  System?: string
  RewriteQuery?: string
  CustomVariables?: string[]
  FirstTokenCost?: NumberLike
  TotalCost?: NumberLike
}

export interface ErrorInfo {
  Code: number
  Message: string
  RequestId?: string
  TraceId?: string
  Elapsed?: NumberLike
  StartTime?: NumberLike
}

export interface ConversationPayload extends ChatConversation {
  IsNewConversation?: boolean
}

export interface RequestAckEvent {
  Type: 'request_ack'
  RequestAck: Record
}

export interface ConversationEvent {
  Type: 'conversation'
  Payload: ConversationPayload
}

export interface ResponseCreatedEvent {
  Type: 'response.created'
  Response: Record
}

export interface ResponseProcessingEvent {
  Type: 'response.processing'
  Response: Record
}

export interface ResponseCompletedEvent {
  Type: 'response.completed'
  Response: Record
}

export interface MessageAddedEvent {
  Type: 'message.added'
  Message: Message
}

export interface MessageProcessingEvent {
  Type: 'message.processing'
  MessageId: string
  Message: Message
}

export interface MessageDoneEvent {
  Type: 'message.done'
  MessageId: string
  Message: Message
}

export interface ContentAddedEvent {
  Type: 'content.added'
  MessageId: string
  ContentIndex: number
  Content: Content
}

export interface ReferenceAddedEvent {
  Type: 'reference.added'
  MessageId: string
  ContentIndex: number
  Reference: Reference
  Timestamp?: NumberLike
}

export interface TextDeltaEvent {
  Type: 'text.delta'
  MessageId: string
  ContentIndex: number
  Text: string
}

export interface ErrorEvent {
  Type: 'error'
  Error: ErrorInfo
}

export type SseEvent =
  | ConversationEvent
  | RequestAckEvent
  | ResponseCreatedEvent
  | ResponseProcessingEvent
  | ResponseCompletedEvent
  | MessageAddedEvent
  | MessageProcessingEvent
  | MessageDoneEvent
  | ContentAddedEvent
  | ReferenceAddedEvent
  | TextDeltaEvent
  | ErrorEvent
