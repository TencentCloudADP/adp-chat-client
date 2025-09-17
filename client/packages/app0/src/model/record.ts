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

export interface TokenStatProcedure {
  Count?: number;
  Debugging?: Debugging;
  Name?: string;
  ResourceStatus?: number;
  Status?: string;
  Title?: string;
}

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

export interface WorkFlow {
  OptionCards?: string[];
  Outputs?: any[];
  WorkflowId?: string;
  WorkflowName?: string;
  WorkflowReleaseTime?: string;
  WorkflowRunId?: string;
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
  IsLlmGenerated?: boolean;
  IsFinal?: boolean;
  OptionCards?: string[];
  QuoteInfos?: QuoteInfo[];
  Reasons?: any[];
  RecordId?: string;
  References?: Reference[];
  RelatedRecordId?: string;
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

export interface Response {
  Records?: Record[];
  RequestId?: string;
  SessionDisassociatedTimestamp?: number;
}

export interface RootObject {
  Response?: Response;
}

export function mergeRecord(record: Record, delta: Record, msg_type: string) {
  const incremental = delta.Incremental
  record.RecordId = delta.RecordId
  if (msg_type === "reply") {
    if (incremental) {
      record.Content = (record.Content||'') + delta.Content
    } else {
      record.Content = delta.Content
    }
    record.OptionCards = delta.OptionCards
    record.QuoteInfos = delta.QuoteInfos
    record.CanRating = delta.CanRating
    record.IsFinal = delta.IsFinal
    record.Score = delta.Score
    record.RelatedRecordId = delta.RelatedRecordId
  } else if (msg_type === "reference") {
    // 处理 ReferenceMessage 合并
    record.References = delta.References
  } else if (msg_type === "thought") {
    // 处理 ThoughtMessage 合并
    let length = record.AgentThought?.Procedures?.length || 0
    if (length > 0 && record.AgentThought?.Procedures?.[length-1].Debugging) {
      if (length == delta.AgentThought?.Procedures?.length) {
        record.AgentThought!.Procedures![length-1].Title = delta.AgentThought!.Procedures![length-1].Title
        record.AgentThought!.Procedures![length-1].Status = delta.AgentThought!.Procedures![length-1].Status
        // 如果procedures长度相同，则说明最后一个过程在增量输出（协议设计不好，应该有明确字段说明），合并最后一条
        if (delta.AgentThought?.Procedures![length-1].Debugging!.Content) {
          if (incremental) {
            record.AgentThought!.Procedures![length-1].Debugging!.Content = (record.AgentThought?.Procedures?.[length-1].Debugging?.Content||'') + delta.AgentThought?.Procedures![length-1].Debugging!.Content
          } else {
            record.AgentThought!.Procedures![length-1].Debugging!.Content = delta.AgentThought?.Procedures![length-1].Debugging!.Content
          }
        }
        if (delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent) {
          if (incremental) {
            record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = (record.AgentThought?.Procedures?.[length-1].Debugging?.DisplayContent||'') + delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
          } else {
            record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
          }
        }
      } else {
        // 如果procedures长度不同，则说明有一个新的过程
        let newLength = delta?.AgentThought?.Procedures?.length || 0
        if (newLength > 0) {
          record.AgentThought!.Procedures!.push(delta?.AgentThought?.Procedures?.[newLength-1]!)
        }
      }
    } else {
      record.AgentThought = delta.AgentThought
    }
  } else if (msg_type === "token_stat") {
    // 处理 TokenStatMessage 合并
    let length = record.TokenStat?.Procedures?.length || 0
    if (length > 0 && record.TokenStat?.Procedures?.[length-1].Debugging) {
      if (length == record.TokenStat?.Procedures?.length) {
        record.TokenStat!.Procedures![length-1].Title = delta.TokenStat!.Procedures![length-1].Title
        record.TokenStat!.Procedures![length-1].Status = delta.TokenStat!.Procedures![length-1].Status
        record.TokenStat!.Procedures![length-1].Debugging = delta.TokenStat!.Procedures![length-1].Debugging
        // 如果procedures长度相同
      } else {
        // 如果procedures长度不同，则说明有一个新的过程
        let newLength = delta?.TokenStat?.Procedures?.length || 0
        if (newLength > 0) {
          record.TokenStat!.Procedures!.push(delta?.TokenStat?.Procedures?.[newLength-1]!)
        }
      }
    } else {
      record.TokenStat = delta.TokenStat
    }
  }
}
