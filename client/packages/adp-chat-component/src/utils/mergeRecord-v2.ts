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
