import type { Record } from '../model/chat'

/**
 * 合并消息记录
 * @param record 原始记录
 * @param delta 增量记录
 * @param msg_type 消息类型
 */
export function mergeRecord(record: Record, delta: Record, msg_type: string) {
  const incremental = delta.Incremental
  record.RecordId = delta.RecordId
  if (msg_type === "reply") {
    if (incremental) {
      record.Content = (record.Content || '') + delta.Content
    } else {
      record.Content = delta.Content
    }
    record.OptionCards = delta.OptionCards
    record.QuoteInfos = delta.QuoteInfos
    record.CanRating = delta.CanRating
    record.IsFinal = delta.IsFinal
    record.Score = delta.Score
    record.RelatedRecordId = delta.RelatedRecordId
    record.IsFromSelf = delta.IsFromSelf
    record.FromAvatar = delta.FromAvatar
    record.FromName = delta.FromName
  } else if (msg_type === "reference") {
    // 处理 ReferenceMessage 合并
    record.References = delta.References
  } else if (msg_type === "thought") {
    // 处理 ThoughtMessage 合并
    const recordProcedures = record.AgentThought?.Procedures
    const deltaProcedures = delta.AgentThought?.Procedures
    const length = recordProcedures?.length ?? 0
    
    if (length > 0 && recordProcedures?.[length - 1]?.Debugging) {
      const deltaLength = deltaProcedures?.length ?? 0
      if (length === deltaLength && deltaProcedures) {
        const lastRecordProc = recordProcedures[length - 1]
        const lastDeltaProc = deltaProcedures[length - 1]
        if (lastRecordProc && lastDeltaProc) {
          lastRecordProc.Title = lastDeltaProc.Title
          lastRecordProc.Status = lastDeltaProc.Status
          // 如果procedures长度相同，则说明最后一个过程在增量输出
          const deltaDebugging = lastDeltaProc.Debugging
          if (deltaDebugging?.Content) {
            if (!lastRecordProc.Debugging) {
              lastRecordProc.Debugging = { Content: '', DisplayContent: '' }
            }
            if (incremental) {
              lastRecordProc.Debugging.Content = (lastRecordProc.Debugging.Content || '') + deltaDebugging.Content
            } else {
              lastRecordProc.Debugging.Content = deltaDebugging.Content
            }
          }
          if (deltaDebugging?.DisplayContent) {
            if (!lastRecordProc.Debugging) {
              lastRecordProc.Debugging = { Content: '', DisplayContent: '' }
            }
            if (incremental) {
              lastRecordProc.Debugging.DisplayContent = (lastRecordProc.Debugging.DisplayContent || '') + deltaDebugging.DisplayContent
            } else {
              lastRecordProc.Debugging.DisplayContent = deltaDebugging.DisplayContent
            }
          }
        }
      } else if (deltaProcedures && deltaProcedures.length > 0) {
        // 如果procedures长度不同，则说明有一个新的过程
        const newProc = deltaProcedures[deltaProcedures.length - 1]
        if (newProc && record.AgentThought?.Procedures) {
          record.AgentThought.Procedures.push(newProc)
        }
      }
    } else {
      record.AgentThought = delta.AgentThought
    }
  } else if (msg_type === "token_stat") {
    // 处理 TokenStatMessage 合并
    const recordProcedures = record.TokenStat?.Procedures
    const deltaProcedures = delta.TokenStat?.Procedures
    const length = recordProcedures?.length ?? 0
    
    if (length > 0 && recordProcedures?.[length - 1]?.Debugging) {
      const deltaLength = deltaProcedures?.length ?? 0
      if (length === deltaLength && deltaProcedures) {
        const lastRecordProc = recordProcedures[length - 1]
        const lastDeltaProc = deltaProcedures[length - 1]
        if (lastRecordProc && lastDeltaProc) {
          lastRecordProc.Title = lastDeltaProc.Title
          lastRecordProc.Status = lastDeltaProc.Status
          lastRecordProc.Debugging = lastDeltaProc.Debugging
        }
      } else if (deltaProcedures && deltaProcedures.length > 0) {
        // 如果procedures长度不同，则说明有一个新的过程
        const newProc = deltaProcedures[deltaProcedures.length - 1]
        if (newProc && record.TokenStat?.Procedures) {
          record.TokenStat.Procedures.push(newProc)
        }
      }
    } else {
      record.TokenStat = delta.TokenStat
    }
  }
}
