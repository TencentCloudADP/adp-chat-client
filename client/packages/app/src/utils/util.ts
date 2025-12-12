import type { Record, Procedure, TokenStatProcedure } from '@/model/chat'
import starSvg from '@/assets/icons/star.svg?url'

export function showToolExecutionResult(procedure: Procedure) {
  return `<button class="tool-btn" data-modal="tool-execution-result">
    <img src="${procedure.Icon}" alt="${procedure.Title}" class="tool-icon" />
    ${procedure.Title}(耗时:${procedure.Elapsed})
    <span class="tool-status ${procedure.Status === 'success' ? 'online' : (procedure.Status === 'processing' ? 'processing' : 'offline')}"></span>
  </button>`
}

export function appendWorkflowExecutionResultToAgentThought(
  displayContent: string,
  procedure: TokenStatProcedure
) {
  // 查找 data-modal="workflow-execution-result" 的 button 标签
  const buttonRegex = /<button[^>]*data-modal=["']workflow-execution-result["'][^>]*>[\s\S]*?<\/button>/i
  
  // 生成新的 button 标签
  const newButton = showWorkflowExecutionResult(procedure)

  // 检查是否存在匹配的 button
  const match = displayContent.match(buttonRegex)

  // console.log('appendWorkflowExecutionResultToAgentThought:', displayContent, newButton, match)
  
  // 如果找到匹配的 button，则替换
  if (match) {
    return displayContent.replace(buttonRegex, newButton)
  }
  
  // 如果没找到，则拼接到 displayContent 后面
  return displayContent + "\n\n\n" + newButton + "\n\n\n"
}

export function showWorkflowExecutionResult(procedure: TokenStatProcedure) {
  const runNodes = procedure.Debugging!.WorkFlow!.RunNodes ?? []
  if (runNodes.length > 0) {
    const runNode = runNodes[runNodes.length - 1]
    const elapsed = runNode.CostMilliSeconds
    const nodeName = runNode.NodeName

    return `<button class="tool-btn" data-modal="workflow-execution-result">
        <img src="${starSvg}" alt="${procedure.Title}" class="tool-icon" />
        ${procedure.Title}|${nodeName}(耗时:${elapsed})
        <span class="tool-status ${procedure.Status === 'success' ? 'online' : (procedure.Status === 'processing' ? 'processing' : 'offline')}"></span>
      </button>`
  }
  
  return ''
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
    record.IsFromSelf = delta.IsFromSelf
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
        if (delta.AgentThought?.Procedures![length-1].Debugging!.Content
          // && delta.AgentThought?.Procedures![length-1].Debugging!.DisplayStatus !== '工具执行') {
          && delta.AgentThought?.Procedures![length-1].PluginType != 1) {
          if (incremental) {
            record.AgentThought!.Procedures![length-1].Debugging!.Content = (record.AgentThought?.Procedures?.[length-1].Debugging?.Content||'') + delta.AgentThought?.Procedures![length-1].Debugging!.Content
          } else {
            record.AgentThought!.Procedures![length-1].Debugging!.Content = delta.AgentThought?.Procedures![length-1].Debugging!.Content
          }
        }

        // if (delta.AgentThought?.Procedures![length-1].Debugging!.DisplayStatus === '工具执行') {
        if (delta.AgentThought?.Procedures![length-1].PluginType == 1) {
          record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = showToolExecutionResult(delta.AgentThought?.Procedures![length-1]!)
        } else {
          if (delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent) {
            if (incremental) {
              record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = (record.AgentThought?.Procedures?.[length-1].Debugging?.DisplayContent||'') + delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
            } else {
              record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
            }
          }
        }
      } else {
        // 如果procedures长度不同，则说明有一个新的过程
        let newLength = delta?.AgentThought?.Procedures?.length || 0
        console.log('length:', length, 'newLength:', newLength)

        if (newLength > length) {
          // 新增1个流程后，上一个流程需要处理，否则上一个流程就会截断数据
          if (delta.AgentThought?.Procedures![length-1].Debugging!.Content 
            // && delta.AgentThought?.Procedures![length-1].Debugging!.DisplayStatus !== '工具执行'
            && delta.AgentThought?.Procedures![length-1].PluginType != 1
          ) {
            if (incremental) {
              record.AgentThought!.Procedures![length-1].Debugging!.Content = (record.AgentThought?.Procedures?.[length-1].Debugging?.Content||'') + delta.AgentThought?.Procedures![length-1].Debugging!.Content
            } else {
              record.AgentThought!.Procedures![length-1].Debugging!.Content = delta.AgentThought?.Procedures![length-1].Debugging!.Content
            }
          }

          // 如果是工具执行节点，使用不同样式显示
          // if (delta.AgentThought?.Procedures![length-1].Debugging!.DisplayStatus === '工具执行') {
          if (delta.AgentThought?.Procedures![length-1].PluginType == 1) {
            record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = showToolExecutionResult(delta.AgentThought?.Procedures![length-1]!)
          } else {
            if (delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent) {
              if (incremental) {
                record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = (record.AgentThought?.Procedures?.[length-1].Debugging?.DisplayContent||'') + delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
              } else {
                record.AgentThought!.Procedures![length-1].Debugging!.DisplayContent = delta.AgentThought?.Procedures![length-1].Debugging!.DisplayContent
              }
            }
          }
        }

        if (newLength > 0) {
          // if (delta?.AgentThought?.Procedures?.[newLength-1]!.Debugging!.DisplayStatus === '工具执行')
          if (delta?.AgentThought?.Procedures?.[newLength-1]!.PluginType == 1)
            // 如果为工具执行流程，则需要将标题作为显示内容
            record.AgentThought!.Procedures!.push({...delta?.AgentThought?.Procedures?.[newLength-1]!, Debugging: {
              DisplayContent: showToolExecutionResult(delta?.AgentThought?.Procedures?.[newLength-1]!),
            }})
          else
            record.AgentThought!.Procedures!.push(delta?.AgentThought?.Procedures?.[newLength-1]!)
        }
      }
    } else {
      record.AgentThought = delta.AgentThought
    }
  } else if (msg_type === "token_stat") {
    // 处理 TokenStatMessage 合并
    let length = delta.TokenStat?.Procedures?.length || 0
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

      // if (delta.TokenStat?.StatusSummaryTitle === '调用工作流') {
      //   let len = record.AgentThought?.Procedures?.length || 0
      //   let procedure = record.AgentThought?.Procedures?.[len-1]
      //   if (procedure) {
      //     if (procedure.PluginType == 1) {
      //       procedure.Debugging!.DisplayContent = 
      //         appendWorkflowExecutionResultToAgentThought(
      //           procedure.Debugging!.DisplayContent ?? '',
      //           delta.TokenStat?.Procedures?.[length-1]! as TokenStatProcedure
      //         )
      //     } else {
      //       procedure.Debugging!.Content = 
      //         appendWorkflowExecutionResultToAgentThought(
      //           procedure.Debugging!.Content ?? '',
      //           delta.TokenStat?.Procedures?.[length-1]! as TokenStatProcedure
      //         )
      //     }
      //   } else {
      //     // if (!record.AgentThought) {
      //     //   record.AgentThought = {
      //     //     Procedures: [],
      //     //   }
      //     // }

      //     // record.AgentThought!.Procedures!.push({
      //     //   Title: delta.TokenStat?.StatusSummaryTitle ?? '',
      //     //   Status: delta.TokenStat?.Procedures?.[length-1]?.Status ?? '',
      //     //   Debugging: {
      //     //     DisplayContent: showWorkflowExecutionResult(delta.TokenStat?.Procedures?.[length-1]! as TokenStatProcedure),
      //     //   },
      //     //   PluginType: 0,
      //     // })
      //   }
      // }
    } else {
      record.TokenStat = delta.TokenStat
    }
  }
}