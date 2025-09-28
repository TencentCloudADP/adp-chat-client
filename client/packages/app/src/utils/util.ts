import type { Record } from '@/model/chat'


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
    record.IsLlmGenerated = delta.IsLlmGenerated
    // TODO： FromAvatar在user时候没有获取到
    record.FromAvatar = delta.FromAvatar
    record.FromName = delta.FromName
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