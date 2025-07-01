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
  OptionCards?: any[];
  QuoteInfos?: any[];
  Reasons?: any[];
  RecordId?: string;
  References?: any[];
  RelatedRecordId?: string;
  ReplyMethod?: number;
  Score?: number;
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

export function mergeRecord(record: Record, delta: Message) {
  if (delta.type === "reply") {
    record.Content = (record.Content||'') + delta.payload.content
  } else if (delta.type === "thought") {
    // 处理 ThoughtMessage 合并
    let length = record.AgentThought?.Procedures?.length || 0
    if (length > 0 && record.AgentThought?.Procedures?.[length-1].Debugging) {
      if (length == delta.payload.procedures.length) {
        record.AgentThought!.Procedures![length-1].Title = delta.payload.procedures[length-1].title
        // 如果procedures长度相同，则说明最后一个过程在增量输出（协议设计不好，应该有明确字段说明），合并最后一条
        if (delta.payload.procedures[length-1].debugging.content) {
          record.AgentThought!.Procedures![length-1].Debugging!.Content = (record.AgentThought?.Procedures?.[length-1].Debugging?.Content||'') + delta.payload.procedures[length-1].debugging.content
        }
      } else {
        // 如果procedures长度不同，则说明有一个新的过程
        let deltaRecord = messageToRecord(delta)
        let newLength = deltaRecord?.AgentThought?.Procedures?.length || 0
        if (newLength > 0) {
          record.AgentThought!.Procedures!.push(deltaRecord?.AgentThought?.Procedures?.[newLength-1]!)
        }
      }
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
        EChartsInfo: message.payload.extra_info.e_charts_info
      },
      FileInfos: message.payload.file_infos ? [message.payload.file_infos] : [],
      FromAvatar: message.payload.from_avatar,
      FromName: message.payload.from_name,
      IsFromSelf: message.payload.is_from_self,
      IsLlmGenerated: message.payload.is_llm_generated,
      OptionCards: message.payload.option_cards ? [message.payload.option_cards] : [],
      QuoteInfos: message.payload.quote_infos ? [message.payload.quote_infos] : [],
      RecordId: message.payload.record_id,
      RelatedRecordId: message.payload.related_record_id,
      ReplyMethod: message.payload.reply_method,
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
  }
  return null
}