<script setup lang="tsx">
import { PlusSquareOutlined, UserOutlined, LinkOutlined, RedoOutlined, CopyOutlined, ShareAltOutlined, LikeFilled, DislikeFilled, LikeOutlined, DislikeOutlined, LoadingOutlined, GlobalOutlined, RightOutlined, FileTextOutlined, BulbOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { Flex, Upload, Button, Checkbox, CheckboxGroup, Space } from 'ant-design-vue'
import { Bubble, BubbleList, Sender, type SenderProps, type BubbleListProps, type BubbleProps, Prompts, type PromptsProps } from 'ant-design-x-vue'
import { Typography } from 'ant-design-vue'
import { ref, reactive, watch, computed, h, onMounted, nextTick, type VNode } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import markdownit from 'markdown-it'
import katex from 'markdown-it-texmath'
import 'katex/dist/katex.min.css'
import type { Message, ReplyMessage } from '@/model/message'
import type { Application } from '@/model/application'
import type { Record } from '@/model/record'
import type { CheckboxProps, UploadProps } from 'ant-design-vue'
import { messageToRecord, mergeRecord, ScoreValue, type QuoteInfo } from '@/model/record'
import { type ChatConversation } from '@/model/conversation'
import { message } from 'ant-design-vue'
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'

// variables
const emit = defineEmits<{
  newConversation: [conversation_id: string]
  conversationUpdate: [conversation: ChatConversation]
}>()

const { shareId = null, copyRawContent = true } = defineProps<{
  shareId?: string,
  copyRawContent?: boolean, // message copy button: copy raw content (otherwise copy text stripped of HTML and Markdown) | 复制按钮：是否复制原始内容(否则复制去除html和markdown后的文本)
}>()
const conversationId = defineModel('conversationId', { type: String })
const listRef = ref<InstanceType<typeof BubbleList>>()
const listContainerRef = ref<HTMLDivElement|null>()
const senderRef = ref<InstanceType<typeof Sender>>()

const scrollOnMsgCount = ref(0)
const scrollReachEnd = ref(true)
const messagesLoading = ref(false)
const skipUpdateOnce = ref(false)
const query = ref("")
const senderLoading = ref(false)
const messages = ref([] as Record[])
let abort = null as AbortController|null
const setQuery = (v: string) => {
  query.value = v
}

// lifecycle
onMounted(async () => {
  console.log('[onMounted]')
  await handleLoadApplication()
})

// applications
const currentApplicationId = ref(undefined as string|undefined)
const applications = ref([] as Application[])
const currentApplication = computed(() => applications.value.find((application) => application['ApplicationId'] == currentApplicationId.value))
const currentApplicationAvatar = computed(() => currentApplication.value?.Avatar)
const currentApplicationName = computed(() => currentApplication.value?.Name)
const currentApplicationGreeting = computed(() => currentApplication.value?.Greeting)
const currentApplicationPrompts = computed(():PromptsProps['items'] =>
  currentApplication.value?.OpeningQuestions?.map((item, index) => (
    {
      key: `${index}`,
      description: item,
    }
  ))
)

const handleLoadApplication = async () => {
    const res = await api.get('/application/list', {})
    if (res.data.Applications) {
        applications.value = res.data.Applications
        if (currentApplicationId.value === undefined) {
            currentApplicationId.value = applications.value[0].ApplicationId
        }
    }
}

const handleCreateConversation = async () => {
  conversationId.value = undefined
}

// roles
const roles: BubbleListProps['roles'] = {
  agent: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
    style: {
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
    style: {
      'flex-direction': 'row',
    },
  },
}

// bubble footer
const rate = async (record: Record, score: ScoreValue) => {
  const post_body = {
    ConversationId: conversationId.value,
    RecordId: record.RecordId,
    Score: score,
  }
  const options = {
  } as AxiosRequestConfig
  const res = await api.post('/feedback/rate', post_body, options)
  console.log(res)
  record.Score = score
}

const renderFooter: BubbleProps['footer'] = (content) => {
  const record = (content as Record)
  const score = record.Score
  const disabled = (score != ScoreValue.Unknown)
  if (!record.CanRating || record.IsFinal===false || shareId) {
    return <></>
  }
  return <Flex>
    <Button
      class="footer-button"
      type="link"
      icon={<RedoOutlined />}
      onClick={() => handleReSend(record.RelatedRecordId)}
    />
    <Button
      class="footer-button"
      type="link"
      icon={<CopyOutlined />}
      onClick={($event) => handleCopy($event, record)}
    />
    <Button
      class="footer-button"
      type="link"
      icon={score == ScoreValue.Like ? <LikeFilled /> : <LikeOutlined />}
      onClick={() => rate(record, ScoreValue.Like)}
      disabled={disabled}
    />
    <Button
      class="footer-button"
      type="link"
      icon={score == ScoreValue.Dislike ? <DislikeFilled /> : <DislikeOutlined />}
      onClick={() => rate(record, ScoreValue.Dislike)}
      disabled={disabled}
    />
    <Button
      class="footer-button"
      type="link"
      icon={<ShareAltOutlined />}
      onClick={ () => handleSelect([record.RecordId, record.RelatedRecordId]) }
    />
  </Flex>
}

// message rendering
function insertReference(content: string, quotes?: QuoteInfo[]): string {
  if (!quotes) {
    return content
  }
  // 1. 将QuoteInfo数组按Position降序排序，这样从后往前插入不会影响前面的位置
  const sortedQuotes = [...quotes].sort((a, b) => (b.Position == a.Position) ? (b.Index > a.Index ? 1 : -1) : (b.Position - a.Position))
  
  // 2. 将字符串转为数组便于操作
  let contentArray = [...content]
  
  // 3. 遍历每个QuoteInfo并插入角标
  for (const quote of sortedQuotes) {
    const { Index, Position } = quote
    // 在指定位置插入角标
    contentArray.splice(Position, 0, `<sup>[${Index}]</sup>`)
  }
  
  // 4. 将数组转回字符串
  return contentArray.join('')
}

const md = markdownit({ html: true, breaks: true })
md.use(katex, {delimiters: ['dollars','brackets','beg_end'], katexOptions: {strict: false, throwOnError: false}})
const renderRecord = (record: Record) => {
  const content = md.render(insertReference(record.Content || '', record.QuoteInfos))
  const hasReferences = record.References && record.References.length > 0
  const hasOptionCards = record.OptionCards && record.OptionCards.length > 0
  const prompts: PromptsProps['items'] = record.OptionCards?.map((card, index) => ({
    key: card,
    description: card,
  }))

  let thinkContent = undefined as VNode[] | undefined
  let isThinking = false
  if (record.AgentThought?.Procedures?.length||0 > 0) {
    if (content === '' && record.AgentThought?.Procedures?.length||0 > 0) {
      isThinking = true
    }
    thinkContent = record.AgentThought?.Procedures?.map((proc, index) => (
      <Typography>
        <p>
          {proc.Title||'已思考'}
        </p>
        <p>
          {proc.TargetAgentName} {renderMarkdown(proc.Debugging?.DisplayContent || proc.Debugging?.Content || '')}
        </p>
      </Typography>
    ))
  }
  const collapse = ref(!isThinking)

  return <Typography>
    { thinkContent !== undefined ?
      <Bubble
        styles={{ footer: { marginTop: '10px' }, content: { cursor: 'pointer', display: 'flex' } }}
        content={
          <div class="thinking-button" onClick={() => {collapse.value = !collapse.value}} >
            <BulbOutlined />
            <span class="thinking-label">{isThinking ? "思考中..." : "已深度思考"}</span>
            {collapse.value ? <UpOutlined /> : <DownOutlined />}
          </div>
        }
        footer={
          <Space direction="vertical">
            { !collapse.value &&
            <Bubble
              class="thinking-content"
              variant="borderless"
              content={thinkContent}
            />
            }
            <div class="content" innerHTML={content} />
          </Space>
        }
      />
    :
      ( content == '' ?
          <Bubble variant="borderless" loading={true} />
        :
          <div class="content" innerHTML={content} />
      )
    }
    {hasReferences && !(record.IsFinal===false) && <div class="reference">
      参考来源：
      {record.References?.map((ref, index) => (
        <p key={index}>
          <a href={ref.Url} target="_blank" rel="noopener noreferrer">
            {ref.Type == 2 ? <FileTextOutlined /> : <GlobalOutlined/>}&nbsp;{index+1}.{ref.Name}&nbsp;<RightOutlined />
          </a>
        </p>
      ))}
      </div>
    }
    {hasOptionCards && !shareId && !(record.IsFinal===false) && <div class="option-cards">
      <Prompts
        items={prompts}
        vertical
        styles={
          {
            item: {
              color: '#1677ff',
              border: '1px solid #1677ff',
              padding: '6px',
            },
          }
        }
        onItemClick={async (info) => {
          await handleSend(info.data.description as string)
        }}
      />
    </div>
    }
  </Typography>
}
const renderMarkdown = (content: string) =>
  <Typography>
    <div innerHTML={md.render(typeof(content) == 'string' ? content as string : '')} />
  </Typography>

// 字段选择关联的消息
const handleSelectChange = async (e: any) => {
  // 查找相关记录
  let RelatedRecordId = undefined as string | undefined
  for (let record of messages.value) {
    if (record.RecordId == e.target.value && record.RelatedRecordId !== '') {
      RelatedRecordId = record.RelatedRecordId
    }
    else if (record.RelatedRecordId == e.target.value) {
      RelatedRecordId = record.RecordId
    }
  }
  if (RelatedRecordId !== undefined) {
    if (selectedRecords.value.indexOf(e.target.value) !== -1) {
      // 取消选择
      await nextTick()
      selectedRecords.value = selectedRecords.value.filter((item, _) => item !== RelatedRecordId)
    }
    else {
      // 选择
      if (selectedRecords.value.indexOf(RelatedRecordId) === -1) {
        selectedRecords.value.push(RelatedRecordId)
      }
    }
  }
  console.log(selectedRecords.value)
}

const isSelection = ref(false)
const selectedRecords = ref([] as string[])
const items = computed(():BubbleListProps['items'] =>
  messages.value.flatMap((record) => {
    let items:any[] = []
    items.push({
      key: record['RecordId'] || '',
      // loading: record['Content']=='',
      variant: record['IsLlmGenerated'] ? 'borderless' : 'filled',
      role: record['IsLlmGenerated'] ? 'agent' : 'user',
      content: record,
      footer: renderFooter,
      avatar: isSelection.value ? <Checkbox class="select-checkbox" value={record['RecordId']} onChange={handleSelectChange}></Checkbox> : <></>,
      messageRender: renderRecord,
    })
    return items
  })
)

// message processing
const handleUpdateMore = async ({ loaded, noMore }: LoadAction) => {
  console.log('[handleUpdateMore]')
  let len = 0
  let LastRecordId = undefined as string|undefined
  if (messages.value.length > 0 && (!!conversationId.value || !!shareId)) {
    LastRecordId = messages.value[0].RecordId
    const options = {
      params: {
        ConversationId: conversationId.value,
        ShareId: shareId,
        LastRecordId: LastRecordId,
      }
    } as AxiosRequestConfig
    try {
      const res = await api.get('/chat/messages', options)
      // console.log(res)
      len = res.data.Response.Records.length
      messages.value = [... res.data.Response.Records, ... messages.value]
    } catch (e) {
      console.log(e)
    }
  }

  // scroll to bottom
  await nextTick()
  if (!!LastRecordId) {
    listRef.value?.scrollTo({ key: LastRecordId, block: 'start', behavior: 'instant' })
  }

  if (len > 0) {
    loaded(len)
  } else {
    noMore()
  }
}
const handleUpdate = async () => {
  if (skipUpdateOnce.value) {
    skipUpdateOnce.value = false
    return
  }
  // restore to default state on new conversation
  abort?.abort()
  abort = null
  scrollReachEnd.value = true
  messages.value = []
  selectedRecords.value = []
  isSelection.value = false
  if (!conversationId.value && !shareId) {
    if (applications.value.length > 0) {
      currentApplicationId.value = applications.value[0].ApplicationId
    }
    return
  }
  const options = {
    params: {
      ConversationId: conversationId.value,
      ShareId: shareId,
    }
  } as AxiosRequestConfig
  try {
    messagesLoading.value = true
    const res = await api.get('/chat/messages', options)
    // console.log(res)
    messages.value = res.data.Response.Records
    currentApplicationId.value = res.data.Response.ApplicationId
  } catch (e) {
    console.log(e)
  }
  messagesLoading.value = false

}
watch(() => [conversationId.value, shareId], handleUpdate, { immediate: true })

const handleSend = async (_lastQuery = null as null|string) => {
  senderLoading.value = true
  recording.value = false
  scrollReachEnd.value = true

  let _query = ''
  if (_lastQuery == null)
  {
    for (const file of fileList.value || []) {
      if (file.status == 'done') {
        _query += `![](${file.url})\n\n`
      }
    }
    _query += query.value
    fileList.value = []
  }
  else
  {
    _query = _lastQuery
  }

  // display user query and agent response placeholder immediately
  const record0: Record = {
    RecordId: 'placeholder-user',
    Content: _query,
    IsLlmGenerated: false,
  }
  messages.value.push(record0)
  const record1: Record = {
    RecordId: 'placeholder-agent',
    Content: '',
    IsLlmGenerated: true,
  }
  messages.value.push(record1)

  abort = new AbortController()
  const post_body = {
    Query: _query,
    ConversationId: conversationId.value,
    ApplicationId: currentApplicationId.value,
  }
  const options = {
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 1000 * 600,
    signal: abort.signal
  } as AxiosRequestConfig
  try {
    const res = await api.post('/chat/message', post_body, options)

    for await (const line of chunkSplitter(res.data)) {
      let msg_body = line.substring(line.indexOf(':')+1).trim()
      let msg_map = JSON.parse(msg_body)
      if (msg_map['type'] == 'custom' && msg_map['name'] == 'new_conversation') {
          let converdation_id = msg_map['value']['ConversationId']
          skipUpdateOnce.value = true
          emit('newConversation', converdation_id)
      } else if (msg_map['type'] == 'custom' && msg_map['name'] == 'conversation_update') {
          let converdation: ChatConversation = msg_map['value']
          emit('conversationUpdate', converdation)
      } else if (msg_map['type'] == 'error') {
        // remove place holder
        messages.value = messages.value.filter((msg, _) => msg.RecordId !== 'placeholder-agent')
        message.error(msg_map['payload']['error']['message'])
      } else {
        let msg: Message = msg_map
        let record = messageToRecord(msg)
        if (record == null) {
          continue
        }
        // user query will be inserted locally
        // TODO: 临时使用record.RelatedRecordId是否存在来判断是不是用户发的消息，后续在ADP后端修复后需要替换成IsFromSelf
        record.IsLlmGenerated = (record.RelatedRecordId !== '')
        if (!record.IsLlmGenerated) {
          // replace RecordId
          for (let item of messages.value) {
            if (item.RecordId == 'placeholder-user') {
              item.RecordId = record.RecordId
            }
          }
          continue
        }

        const lastIndex = messages.value.length - 1
        if (messages.value[lastIndex].RecordId == 'placeholder-agent') {
          messages.value[lastIndex].RecordId = record.RecordId
        }
        if (lastIndex >= 0 && messages.value[lastIndex].RecordId == record.RecordId) {
          mergeRecord(messages.value[lastIndex], record, msg)
        } else {
          messages.value.push(record)
        }
      }
      // console.log(msg_map)
    }
  } catch (e) {
    console.log(e)
  }
  console.log('done')
  senderLoading.value = false
}
const handleReSend = async (recordId: string|undefined) => {
  const related = messages.value.filter((record) => record.RecordId == recordId)
  if (related.length == 0) {
    return
  }
  await handleSend(related[0].Content)
}
const doCopy = async (content: string, tips = '') => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(content)
      message.info(`${tips}复制成功`)
    } catch (err) {
      message.info(`复制失败（${err}）`)
    }
  } else {
    message.error(`复制失败（请使用https协议部署！）`)
  }
}
const handleCopy = async (event: Event|undefined, record: Record) => {
  const container = event?.target as HTMLElement
  let text = container?.closest('.ant-bubble-content-wrapper')?.querySelector('.content')?.textContent
  text = text?.replace(/\n{3,}/g, '\n\n')
  if (copyRawContent || text == null) {
    text = record.Content || ''
  }
  await doCopy(text)
}
const handleStop = async () => {
  abort?.abort()
  abort = null
}

// file upload
const fileList = ref([] as UploadProps['fileList'])
const handleFile = async (file: any, _: any[]) => {
  const allowed = ['image/png', 'image/jpeg']
  if (!allowed.includes(file.type)) {
    message.error(`${file.name} 暂不支持该类型文件（支持类型：jpg/png）`)
    return Upload.LIST_IGNORE
  }

  const options = {
  } as AxiosRequestConfig
  const res = await api.post(`/file/upload?ApplicationId=${currentApplicationId.value}`, file, options)
  if ('Url' in res.data) {
    const url = res.data['Url']
    fileList.value?.push({
      uid: url,
      name: '',
      status: 'done',
      response: '',
      url: url,
    })
  } else {
    console.log(res)
    message.error('upload failed')
  }
  
  return Upload.LIST_IGNORE
}

// asr
import WebRecorder from "@/util/webRecorder.js"
const queryBeforeAsr = ref('')
const recorder = ref(null as WebRecorder|null)
const asrWebSocket = ref(null as WebSocket|null)
const recording = ref(false)
type SpeechConfig = SenderProps['allowSpeech']
const startRecording = () => {
  const requestId = '0'
  recorder.value = new WebRecorder({requestId: requestId})
  recorder.value.OnReceivedData = (data) => {
    if (asrWebSocket.value?.readyState === WebSocket.OPEN) {
      asrWebSocket.value?.send(data)
    }
  }
  // 录音失败时
  recorder.value.OnError = (err) => {
    message.error(err)
    recording.value = false
  }
  recorder.value.start()
  queryBeforeAsr.value = query.value
  console.log('[asr] start')
}
watch(() => recording.value, async () => {
  if (recording.value) {
    const res = await api.get(`/helper/asr/url`)
    const url = res['data']['url']
    asrWebSocket.value = new WebSocket(url)
    asrWebSocket.value.onopen = () => {
      startRecording()
    }
    asrWebSocket.value.onmessage = (event) => {
      if (!recording.value) {
        return
      }
      const msg = JSON.parse(event.data)
      if ('result' in msg) {
        query.value = queryBeforeAsr.value + msg['result']['voice_text_str']
      }
      if ('message' in msg && 'code' in msg && msg['code'] != 0) {
        message.error(msg['message'])
      }
    }
    asrWebSocket.value.onclose = () => {
      recording.value = false      
    }
  }
  else
  {
    console.log('[asr] stop')
    recorder.value?.stop()
    recorder.value = null
    asrWebSocket.value?.close()
    asrWebSocket.value = null
  }
})
const speechConfig = computed<SpeechConfig>(
  () => ({
    recording: recording.value,
    onRecordingChange: (nextRecording) => {
      recording.value = nextRecording
    },
  }
))

// handle share
const handleSelect = (recordIds: (string|undefined)[]) => {
  isSelection.value = !isSelection.value
  selectedRecords.value = recordIds.filter((item): item is string => item !== undefined)
}
const handleShare = async () => {
  if (selectedRecords.value.length == 0) {
    message.error(`请选择要分享的消息`)
    return
  }
  const post_body = {
    ConversationId: conversationId.value,
    ApplicationId: currentApplicationId.value,
    RecordIds: selectedRecords.value,
  }
  const options = {
  } as AxiosRequestConfig
  const res = await api.post('/share/create', post_body, options)

  if (res.data.ShareId) {
    const baseUrl = window.location.href.split('#')[0]
    const url = `${baseUrl}#/share/${res.data.ShareId}`
    await doCopy(url, `分享链接`)
  }

  selectedRecords.value = []
  isSelection.value = false
}
// scroll event handler
const onScroll = (e: Event) => {
  const AUTO_SCROLL_TOLERANCE = 1
  const target = e.target as HTMLElement
  const distance = target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight
  // console.log(`[onScroll], ${distance}, ${scrollOnMsgCount.value}`)

  // 内容高度变化可能触发多次onScroll事件，需要避免因此误判用户滚动
  if (scrollOnMsgCount.value > 0) {
    scrollOnMsgCount.value -= 1
    return
  }

  scrollReachEnd.value = distance <= AUTO_SCROLL_TOLERANCE
}
// auto scroll on content height change
watch(() => listContainerRef.value, async (newValue, oldValue) => {
  if (oldValue) {
    resizeObserver.unobserve(oldValue)
  }
  if (newValue) {
    resizeObserver.observe(newValue)
  }
})
watch(() => isSelection.value, async (newValue, oldValue) => {
  // isSelection改变时可能触发onScroll事件，通过onResize标识为主动触发
  onResize()
})
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    // console.log(`Element resized: ${entry.contentRect.width} x ${entry.contentRect.height}`)
    onResize()
  }
})
const onResize = () => {
  if (messages.value.length == 0) {
    return
  }
  // console.log(`[onResize], ${scrollReachEnd.value}, ${scrollOnMsgCount.value}`
  if (scrollReachEnd.value) {
    if (scrollOnMsgCount.value < 3) {
      // 在iOS上，一次resize事件后可能有2次onScroll事件，需要避免因此误判用户滚动
      scrollOnMsgCount.value += 2
    }
    listRef.value?.scrollTo({ key: messages.value[messages.value.length-1].RecordId, block: 'end', behavior: 'instant' })
  }
}
</script>

<template>
  <a-layout-header id="chat-header">
    <slot name="header"></slot>

    <a-select v-model:value="currentApplicationId" style="width: 200px; margin: 0 auto" id="agent-select" :disabled="!!conversationId || !!shareId">
      <a-select-option v-for="application in applications" :value="application['ApplicationId']">{{application['Name']}}</a-select-option>
    </a-select>

    <plus-square-outlined v-if="!shareId" class="chat-header-btn" @click="handleCreateConversation" />
  </a-layout-header>
  <a-layout-content id="chat">
    <flex
      vertical
      :style="{ 'height': '100%' }"
      gap="middle"
    >
      <flex v-if="messages.length == 0 && !conversationId && !shareId" class="greeting-panel">
        <img :src="currentApplicationAvatar" class="avatar" />
        <div class="name">{{ currentApplicationName }}</div>
        <div v-if="!!currentApplicationGreeting" class="greeting">{{ currentApplicationGreeting }}</div>
        <prompts v-if="(currentApplicationPrompts?.length || 0) > 0" :items="currentApplicationPrompts" :onItemClick="(info) => setQuery(info.data.description?.toString()||'')" vertical class="prompts" />
      </flex>
      <flex v-else-if="messagesLoading" class="loading-panel">
        <loading-outlined />
      </flex>
      <checkbox-group v-else v-model:value="selectedRecords" class="bubble-list-wrap" :onscroll="onScroll">
        <div ref="listContainerRef" class="bubble-list-container">
          <VueEternalLoading class="infinite-loading" :isFirstLoad="false" position="top" :load="handleUpdateMore">
            <template #loading>
              <div><loading-outlined /></div>
            </template>
            <template #no-more>
              <div class="no-more"></div>
            </template>
          </VueEternalLoading>

          <BubbleList
            ref="listRef"
            class="bubble-list"
            :roles="roles"
            :items="items"
          />
        </div>
      </checkbox-group>
      <flex class="share-panel" v-if="isSelection">
        <div class="share-panel-space"/>
        <a-button @click="handleShare">分享</a-button>
        <a-button @click="isSelection=false">取消</a-button>
        <div class="share-panel-space"/>
      </flex>
      <sender
        ref="senderRef"
        v-if="!isSelection && !shareId"
        :loading="senderLoading"
        :value="query"
        :on-change="setQuery"
        :allow-speech="speechConfig"
        :on-submit="() => {
          handleSend()
          setQuery('')
          senderRef?.blur()
        }"
        :on-cancel="() => {
          handleStop()
          senderRef?.blur()
        }"
      >
        <template #prefix>
          <a-upload
            v-model:file-list="fileList"
            :before-upload="handleFile"
            list-type="picture"
            accept="image/png,image/jpeg,.jpg,.jpeg,.png"
            multiple
          >
            <a-button shape="circle">
              <link-outlined></link-outlined>
            </a-button>
          </a-upload>
        </template>
      </sender>
    </flex>
  </a-layout-content>
</template>

<style>

.reference {
  color: gray;
}
.reference p {
  margin: 0;
}
.thinking-label {
  user-select: none;
}
#chat-header {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
}
.chat-header-btn {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.chat-header-btn:hover {
  color: #1890ff;
}
#chat {
  background: #fff;
  padding: 0 16px 16px 16px;
  margin: 0;
  min-height: 150px;
}

.bubble-list {
  width: 100%;
}
.infinite-loading div {
  width: 30px;
  margin: 0 auto;
}
.bubble-list-wrap {
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  cursor: inherit;
  white-space: inherit;
}
.select-checkbox {
  margin-right: 12px;
}
.thinking-button {
  margin: 6px 0;
  gap: 8px;
  display: inline-flex;
  align-items: center;
}
.thinking-content .ant-typography {
  color: gray !important;
}
.ant-bubble {
  column-gap: 0;
}
.bubble-list-container {
  width: 100%;
}
.loading-panel,
.greeting-panel {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
}
.greeting-panel .avatar {
  width: 64px;
  height: 64px;
  margin: 20px auto 0;
}
.greeting-panel .name {
  margin-top: 16px;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  text-align: center;
}
.greeting-panel .greeting {
  margin-top: 16px;
  padding: 10px;
}
.greeting-panel .prompts {
  margin-top: 16px;
}

.bubble-list img {
  width: 100%;
  max-width: 640px;
}

.share-panel {
  padding: 12px 0;
}
.share-panel button {
  margin-right: 12px;
}
.share-panel-space {
  flex-grow: 1;
}

.footer-button:hover,
.footer-button:focus {
  border: 0 !important;
  outline: 0 !important;
}

.ant-bubble-content {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 12px !important;
  min-height: 38px !important;
}
.ant-bubble-content p {
  margin: 8px 0;
}
.ant-bubble-content-borderless {
  padding: 0 6px !important;
}
.ant-bubble-content table {
  border: 1px solid #ddd;
  border-collapse: collapse;
}
.ant-bubble-content td, th {
  border: 1px solid #ddd;
}

.ant-bubble-end .ant-bubble-content-filled {
  background-color: cornflowerblue;
}
.ant-bubble-end .ant-bubble-content-filled p {
  color: white;
}
</style>
