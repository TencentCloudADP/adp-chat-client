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
    OptionCards?: any[];
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
  OptionCards?: any[];
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
  OptionCards?: any[];
  QuoteInfos?: any[];
  Reasons?: any[];
  RecordId?: string;
  References?: any[];
  RelatedRecordId?: string;
  ReplyMethod?: number;
  Score?: ScoreValue;
  SessionId?: string;
  TaskFlow?: any;
  Timestamp?: string;
  TokenStat?: TokenStat;
  Type?: number;
  WorkFlow?: WorkFlow;
}

export interface Response {
  Records?: Record[];
  RequestId?: string;
  SessionDisassociatedTimestamp?: string;
}

export interface RootObject {
  Response?: Response;
}

import type { Message } from '@/model/message'

export function mergeRecord(record: Record, delta: Record, msg: Message) {
  const incremental = false
  if (msg.type === "reply") {
    if (incremental) {
      record.Content = (record.Content||'') + delta.Content
    } else {
      record.Content = delta.Content
    }
    record.CanRating = delta.CanRating
    record.IsFinal = delta.IsFinal
    record.Score = delta.Score
    record.RecordId = delta.RecordId
    record.RelatedRecordId = delta.RelatedRecordId
  } else if (msg.type === "thought") {
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
  } else if (msg.type === "token_stat") {
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

export function messageToRecord(message: Message): Record | null {
  if (message.type === "reply") {
    // 处理 ReplyMessage 转换
    return {
      CanFeedback: message.payload.can_feedback,
      CanRating: message.payload.can_rating,
      Content: message.payload.content,
      ExtraInfo: {
        EChartsInfo: message.payload.extra_info?.e_charts_info
      },
      FileInfos: message.payload.file_infos ? [message.payload.file_infos] : [],
      FromAvatar: message.payload.from_avatar,
      FromName: message.payload.from_name,
      IsFromSelf: message.payload.is_from_self,
      IsLlmGenerated: message.payload.is_llm_generated,
      IsFinal: message.payload.is_final,
      OptionCards: message.payload.option_cards ? [message.payload.option_cards] : [],
      QuoteInfos: message.payload.quote_infos ? [message.payload.quote_infos] : [],
      RecordId: message.payload.record_id,
      RelatedRecordId: message.payload.related_record_id,
      ReplyMethod: message.payload.reply_method,
      Score: ScoreValue.Unknown,
      SessionId: message.payload.session_id,
      Timestamp: new Date(message.payload.timestamp * 1000).toISOString(),
      Type: 1 // 假设 1 表示回复类型
    };
  } else if (message.type === "thought") {
    // 处理 ThoughtMessage 转换
    return {
      AgentThought: {
        // 假设 AgentThought 接口与 ThoughtMessage 的 Procedures 相关
        Procedures: message.payload.procedures.map(proc => ({
          AgentIcon: proc.agent_icon,
          Debugging: {
            Content: proc.debugging.content,
            DisplayContent: proc.debugging.display_content,
          },
          Elapsed: proc.elapsed,
          Icon: proc.icon,
          Index: proc.index,
          Name: proc.name,
          NodeName: proc.node_name,
          PluginType: proc.plugin_type,
          ReplyIndex: proc.reply_index,
          SourceAgentName: proc.source_agent_name,
          Status: proc.status,
          Switch: proc.switch,
          TargetAgentName: proc.target_agent_name,
          Title: proc.title,
          WorkflowName: proc.workflow_name
        })),
        Elapsed: message.payload.elapsed,
        IsWorkflow: message.payload.is_workflow,
        WorkflowName: message.payload.workflow_name
      },
      IsLlmGenerated: true,
      RecordId: message.payload.record_id,
      SessionId: message.payload.session_id,
      Timestamp: new Date().toISOString(), // ThoughtMessage 没有 timestamp，使用当前时间
      Type: 1 // 假设 1 表示回复类型
    };
  } else if (message.type === "token_stat") {
    return {
      TokenStat: {
        Elapsed: message.payload.elapsed,
        FreeCount: message.payload.free_count,
        OrderCount: message.payload.order_count,
        Procedures: message.payload.procedures?.map(proc => ({
          Count: proc.count,
          Debugging: {
            Content: proc.debugging?.content,
            Knowledge: [
                // TODO: message协议缺失这部分内容
            ],
            WorkFlow: {
                WorkflowName: proc.debugging?.work_flow?.workflow_name,
                RunNodes: proc.debugging?.work_flow?.run_nodes?.map(node => ({
                    CostMilliSeconds: node.cost_milli_seconds,
                    Input: node.input,
                    IsCurrent: node.is_current,
                    NodeId: node.node_id,
                    NodeName: node.node_name,
                    NodeType: node.node_type,
                    Output: node.output,
                    Status: node.status,
                    StatisticInfos: node.statistic_infos?.map(info => ({
                        FirstTokenCost: info.first_token_cost,
                        InputTokens: info.input_tokens,
                        ModelName: info.model_name,
                        OutputTokens: info.output_tokens,
                        TotalCost: info.total_cost,
                        TotalTokens: info.total_tokens
                    })),
                    TaskOutput: node.task_output
                })),
            }
          },
          InputCount: proc.input_count,
          Name: proc.name,
          OutputCount: proc.output_count,
          ResourceStatus: proc.resource_status,
          Status: proc.status,
          Title: proc.title
        })),
        RecordId: message.payload.record_id,
        RequestId: message.payload.request_id,
        SessionId: message.payload.session_id,
        StatusSummary: message.payload.status_summary,
        StatusSummaryTitle: message.payload.status_summary_title,
        TokenCount: message.payload.token_count,
        TraceId: message.payload.trace_id,
        UsedCount: message.payload.used_count
      },
      IsLlmGenerated: true,
      RecordId: message.payload.record_id,
      SessionId: message.payload.session_id,
      Timestamp: new Date().toISOString(),
      Type: 1
    };
  }
  return null
}