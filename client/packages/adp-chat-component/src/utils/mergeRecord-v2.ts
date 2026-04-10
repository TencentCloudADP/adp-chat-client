import type { Content, Message, Record, SseEvent } from '../model/chat-v2'

export function applySseEventToRecord(event: SseEvent, current?: Record): Record | undefined {
  switch (event.Type) {
    case 'request_ack':
      return mergeRecord(current, event.RequestAck, true)
    case 'response.created':
    case 'response.processing':
    case 'response.completed':
      return mergeRecord(current, event.Response, event.Type === 'response.completed')
    case 'message.added':
      return upsertMessage(current, event.Message)
    case 'message.processing':
    case 'message.done':
      return upsertMessage(current, event.Message)
    case 'content.added':
      return addContent(current, event.MessageId, event.ContentIndex, event.Content)
    case 'reference.added':
      return addReference(current, event.MessageId, event.ContentIndex, event.Reference)
    case 'text.delta':
      return appendTextDelta(current, event.MessageId, event.ContentIndex, event.Text)
    default:
      return current
  }
}

function mergeRecord(current: Record | undefined, incoming: Record, replaceMessages: boolean): Record {
  const merged: Record = { ...(current ?? incoming), ...incoming }
  if (incoming.Messages === undefined && current?.Messages) {
    merged.Messages = current.Messages
  } else if (replaceMessages && incoming.Messages !== undefined) {
    merged.Messages = incoming.Messages
  }
  if (incoming.Procedures === undefined && current?.Procedures) {
    merged.Procedures = current.Procedures
  }
  if (incoming.StatInfo === undefined && current?.StatInfo) {
    merged.StatInfo = current.StatInfo
  }
  if (incoming.ExtraInfo === undefined && current?.ExtraInfo) {
    merged.ExtraInfo = current.ExtraInfo
  }
  return merged
}

function upsertMessage(current: Record | undefined, incoming: Message): Record | undefined {
  if (!current) {
    return undefined
  }
  const messages = current.Messages ? [...current.Messages] : []
  const idx = messages.findIndex((msg) => msg.MessageId === incoming.MessageId)
  if (idx === -1) {
    messages.push(incoming)
  } else {
    const existing = messages[idx]
    if (existing) {
      const merged: Message = {
        ...existing,
        ...incoming,
        Contents: incoming.Contents !== undefined ? incoming.Contents : existing.Contents,
        ExtraInfo: incoming.ExtraInfo
          ? { ...(existing.ExtraInfo ?? {}), ...incoming.ExtraInfo }
          : existing.ExtraInfo,
      }
      messages[idx] = merged
    } else {
      messages[idx] = incoming
    }
  }
  return { ...current, Messages: messages }
}

function addContent(
  current: Record | undefined,
  messageId: string,
  contentIndex: number,
  content: Content,
): Record | undefined {
  if (!current) {
    return undefined
  }
  const { message, messages, messageIndex } = ensureMessage(current, messageId)
  if (!message) {
    return { ...current, Messages: messages }
  }
  const contents = message.Contents ? [...message.Contents] : []
  const existing = contents[contentIndex]
  contents[contentIndex] = existing ? { ...existing, ...content } : content
  messages[messageIndex] = { ...message, Contents: contents }
  return { ...current, Messages: messages }
}

function appendTextDelta(
  current: Record | undefined,
  messageId: string,
  contentIndex: number,
  text: string,
): Record | undefined {
  if (!current) {
    return undefined
  }
  const { message, messages, messageIndex } = ensureMessage(current, messageId)
  if (!message) {
    return { ...current, Messages: messages }
  }
  const contents = message.Contents ? [...message.Contents] : []
  const existing = contents[contentIndex]
  const base: Content = existing ?? { Type: 'text', Text: '' }
  const nextText = (base.Text ?? '') + text
  contents[contentIndex] = { ...base, Text: nextText }
  messages[messageIndex] = { ...message, Contents: contents }
  return { ...current, Messages: messages }
}

/**
 * 将 widget 内容转换为 Markdown 代码块格式
 * @param content Content 对象
 * @returns 包含 widget Markdown 代码块的文本，如果不是 widget 类型则返回空字符串
 */
export function widgetContentToMarkdown(content: Content): string {
  if (content.Type !== 'widget' || !content.Widget) {
    return ''
  }
  
  // 优先使用 View 字段，如果没有则尝试解码 EncodedWidget
  let widgetJson: string | undefined;
  let widgetViewObj: { [key: string]: unknown } | undefined;
  
  if (content.Widget.View) {
    // View 可能是字符串（JSON 格式）或对象
    if (typeof content.Widget.View === 'string') {
      // 已经是 JSON 字符串，尝试解析
      try {
        widgetViewObj = JSON.parse(content.Widget.View);
      } catch {
        widgetJson = content.Widget.View;
      }
    } else {
      // 是对象
      widgetViewObj = content.Widget.View as { [key: string]: unknown };
    }
  } else if (content.Widget.EncodedWidget) {
    // 尝试从 EncodedWidget 解码（可能是 base64 编码或 URL 编码）
    let decoded: string | undefined;
    try {
      // 首先尝试 base64 解码
      decoded = atob(content.Widget.EncodedWidget);
    } catch {
      // 如果 base64 解码失败，尝试 URL 解码
      try {
        decoded = decodeURIComponent(content.Widget.EncodedWidget);
      } catch {
        // 如果都失败了，直接使用原始值
        decoded = content.Widget.EncodedWidget;
      }
    }
    if (decoded) {
      try {
        widgetViewObj = JSON.parse(decoded);
      } catch {
        widgetJson = decoded;
      }
    }
  }
  
  // 如果成功解析为对象，注入 WidgetId 和 WidgetRunId
  if (widgetViewObj) {
    // 将 WidgetId 和 WidgetRunId 注入到 widget JSON 中的 _meta 字段
    // 这样 MdContent 可以从中提取这些信息
    widgetViewObj._adp_widget_meta = {
      widgetId: content.Widget.WidgetId || '',
      widgetRunId: content.Widget.WidgetRunId || '',
    };
    widgetJson = JSON.stringify(widgetViewObj);
  }
  
  if (!widgetJson) {
    return '';
  }
  
  return `\n\n\`\`\`adp-widget\n${widgetJson}\n\`\`\``
}

function addReference(
  current: Record | undefined,
  messageId: string,
  contentIndex: number,
  reference: NonNullable<Extract<SseEvent, { Type: 'reference.added' }>['Reference']>,
): Record | undefined {
  if (!current) {
    return undefined
  }
  const { message, messages, messageIndex } = ensureMessage(current, messageId)
  if (!message) {
    return { ...current, Messages: messages }
  }

  const contents = message.Contents ? [...message.Contents] : []
  const existing = contents[contentIndex]
  const base: Content = existing ?? { Type: 'text', Text: '' }
  const currentReferences = base.References ? [...base.References] : []
  const nextReferences = upsertReference(currentReferences, reference)

  contents[contentIndex] = {
    ...base,
    References: nextReferences,
  }
  messages[messageIndex] = { ...message, Contents: contents }
  return { ...current, Messages: messages }
}

function ensureMessage(current: Record, messageId: string) {
  const messages = current.Messages ? [...current.Messages] : []
  let messageIndex = messages.findIndex((msg) => msg.MessageId === messageId)
  if (messageIndex === -1) {
    const placeholder: Message = {
      MessageId: messageId,
      Type: 'notice',
      Name: '',
      Title: '',
      Status: 'processing',
      StatusDesc: '',
      Contents: [],
    }
    messages.push(placeholder)
    messageIndex = messages.length - 1
  }
  const message = messages[messageIndex]
  return { message, messages, messageIndex }
}

function upsertReference(
  references: NonNullable<Content['References']>,
  incoming: NonNullable<Extract<SseEvent, { Type: 'reference.added' }>['Reference']>,
) {
  const next = [...(references ?? [])]
  const incomingKey = getReferenceKey(incoming)
  const idx = next.findIndex((reference) => getReferenceKey(reference) === incomingKey)
  if (idx === -1) {
    next.push(incoming)
  } else {
    const existing = next[idx]
    if (existing) {
      next[idx] = {
        ...existing,
        ...incoming,
        DocRefer: incoming.DocRefer ? { ...(existing.DocRefer ?? {}), ...incoming.DocRefer } : existing.DocRefer,
        QaRefer: incoming.QaRefer ? { ...(existing.QaRefer ?? {}), ...incoming.QaRefer } : existing.QaRefer,
        WebSearchRefer: incoming.WebSearchRefer
          ? { ...(existing.WebSearchRefer ?? {}), ...incoming.WebSearchRefer }
          : existing.WebSearchRefer,
      }
    } else {
      next[idx] = incoming
    }
  }
  return next
}

function getReferenceKey(reference: NonNullable<Extract<SseEvent, { Type: 'reference.added' }>['Reference']>) {
  return (
    reference.Id ||
    reference.ReferBizId ||
    reference.DocRefer?.ReferenceId ||
    reference.DocRefer?.ReferBizId ||
    reference.QaRefer?.ReferBizId ||
    reference.Url ||
    reference.DocRefer?.Url ||
    `${reference.Index ?? ''}:${reference.Name ?? ''}`
  )
}
