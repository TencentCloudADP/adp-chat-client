export interface ChatConversation {
  Id: string
  AccountId: string
  Title: string
  LastActiveAt: number
  CreatedAt: number
  ApplicationId: string
}

export interface ChatConversationProps {
  ConversationId?: string,
  ShareId?: string,
  LastRecordId?: string,
}

export interface AgentThought {
  Elapsed?: number;
  Files?: any[];
  IsWorkflow?: boolean;
  Procedures?: Procedure[];
  RecordId?: string;
  RequestId?: string;
  SessionId?: string;
  TraceId?: string;
  WorkflowName?: string;
}

export interface Debugging {
  Content?: string;
  DisplayContent?: string;
  DisplayStatus?: string;
  DisplayType?: number;
  DisplayUrl?: string;
  QuoteInfos?: any[];
  References?: any[];
  SandboxUrl?: string;
  Agent?: {
    Input?: string;
    Output?: string;
  };
  CustomVariables?: any[];
  Histories?: any[];
  Knowledge?: any[];
  System?: string;
  TaskFlow?: {
    IntentName?: string;
    Purposes?: any[];
    RunNodes?: any[];
    UpdatedSlotValues?: any[];
  };
  WorkFlow?: {
    OptionCards?: string[];
    Outputs?: any[];
    RunNodes?: any[];
    WorkflowId?: string;
    WorkflowName?: string;
    WorkflowReleaseTime?: string;
    WorkflowRunId?: string;
  };
}

export interface Procedure {
  AgentIcon?: string;
  Debugging?: Debugging;
  Elapsed?: number;
  Icon?: string;
  Index?: number;
  Name?: string;
  NodeName?: string;
  ReplyIndex?: number;
  SourceAgentName?: string;
  Status?: string;
  Switch?: string;
  TargetAgentName?: string;
  Title?: string;
  WorkflowName?: string;
}
export interface ExtraInfo {
  EChartsInfo?: any;
}
export interface QuoteInfo {
  Index: string;
  Position: number;
}

export interface Reference {
  Type: number;
  Url: string;
  DocBizId: string;
  Id: string;
  QaBizId: string;
  Name: string;
  DocId: string;
  KnowledgeBizId?: string;
  KnowledgeName?: string;
}


export const ScoreValue = {
  Unknown: 0,
  Like: 1,
  Dislike: 2
} as const
export type ScoreValue = typeof ScoreValue[keyof typeof ScoreValue]

export interface TokenStat {
  Elapsed?: number;
  FreeCount?: number;
  OrderCount?: number;
  Procedures?: TokenStatProcedure[];
  RecordId?: string;
  RequestId?: string;
  SessionId?: string;
  StatusSummary?: string;
  StatusSummaryTitle?: string;
  TokenCount?: number;
  TraceId?: string;
  UsedCount?: number;
}

export interface TokenStatProcedure {
  Count?: number;
  Debugging?: Debugging;
  Name?: string;
  ResourceStatus?: number;
  Status?: string;
  Title?: string;
}


export interface Record {
  AgentThought?: AgentThought;
  CanFeedback?: boolean;
  CanRating?: boolean;
  Content?: string;
  ExtraInfo?: ExtraInfo;
  FileInfos?: any[];
  FromAvatar?: string;
  FromName?: string;
  HasRead?: boolean;
  ImageUrls?: any[];
  IsFromSelf?: boolean;
  IsLlmGenerated?: boolean; //  false: user true: agent
  IsFinal?: boolean;
  OptionCards?: string[];
  QuoteInfos?: QuoteInfo[];
  Reasons?: any[];
  RecordId: string;
  References?: Reference[];
  RelatedRecordId: string;
  ReplyMethod?: number;
  Score?: ScoreValue;
  SessionId?: string;
  TaskFlow?: any;
  Timestamp?: number;
  TokenStat?: TokenStat;
  Type?: number;
  WorkFlow?: WorkFlow;
  Incremental?: boolean;
}


export interface ChatItem {
  avatar: string
  name: string
  datetime: string
  reasoning?: string // 推理内容，可选
  content: string
  role: 'user' | 'assistant' | 'error' | 'model-change' | 'system' | undefined
  duration?: number // 推理内容持续时间，可选
}

export interface WorkFlow {
  OptionCards?: string[];
  Outputs?: any[];
  WorkflowId?: string;
  WorkflowName?: string;
  WorkflowReleaseTime?: string;
  WorkflowRunId?: string;
}