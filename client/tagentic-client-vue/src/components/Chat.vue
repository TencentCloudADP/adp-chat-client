<script setup lang="tsx">
import { PlusSquareOutlined, UserOutlined, LinkOutlined, RedoOutlined, CopyOutlined, ShareAltOutlined, LikeFilled, DislikeFilled, LikeOutlined, DislikeOutlined, LoadingOutlined, GlobalOutlined, RightOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { Flex, Upload, Button, Checkbox, CheckboxGroup } from 'ant-design-vue'
import { Bubble, BubbleList, Sender, type SenderProps, ThoughtChain, type BubbleListProps, type BubbleProps, Prompts, type PromptsProps } from 'ant-design-x-vue'
import { Typography } from 'ant-design-vue'
import { ref, reactive, watch, computed, h, onMounted, nextTick } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import markdownit from 'markdown-it'
import katex from 'markdown-it-texmath'
import 'katex/dist/katex.min.css'
import type { Message, ReplyMessage } from '@/model/message'
import type { Application } from '@/model/application'
import type { Record } from '@/model/record'
import type { UploadProps } from 'ant-design-vue'
import { messageToRecord, mergeRecord, ScoreValue, type QuoteInfo } from '@/model/record'
import { type ChatConversation } from '@/model/conversation'
import { message } from 'ant-design-vue'
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'

// variables
const emit = defineEmits<{
  newConversation: [conversation_id: string]
  conversationUpdate: [conversation: ChatConversation]
}>()

const { shareId = null } = defineProps<{
  shareId?: string,
}>()
const conversationId = defineModel('conversationId', { type: String })
const listRef = ref<InstanceType<typeof BubbleList>>()

const scrollOnMsgTs = ref(new Date().getTime())
const scrollOnMsgCount = ref(0)
const scrollReachEnd = ref(true)
const messagesLoading = ref(false)
const skipUpdateOnce = ref(false)
const query = ref("")
const senderLoading = ref(false)
const messages = ref([] as Record[])
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
const currentApplication = computed(() => applications.value.find((application) => application['AppBizId'] == currentApplicationId.value))
const currentApplicationAvatar = computed(() => currentApplication.value?.BaseConfig.Avatar)
const currentApplicationName = computed(() => currentApplication.value?.BaseConfig.Name)
const currentApplicationGreeting = computed(() => currentApplication.value?.AppConfig.KnowledgeQa.Greeting)
const currentApplicationPrompts = computed(():PromptsProps['items'] =>
  currentApplication.value?.AppConfig.KnowledgeQa.OpeningQuestions?.map((item, index) => (
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
            currentApplicationId.value = applications.value[0].AppBizId
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
  thought: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) =>
      h(ThoughtChain, { collapsible: { expandedKeys: expandedKeys.value, onExpand }, items: items as any }),
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
      onClick={() => handleCopy(record)}
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
  return <Typography>
    <div innerHTML={content} />
    {hasReferences && <div class="reference">
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
  </Typography>
}
const renderMarkdown = (content: string) =>
  <Typography>
    <div innerHTML={md.render(typeof(content) == 'string' ? content as string : '')} />
  </Typography>

const isSelection = ref(false)
const selectedRecords = ref([] as string[])
const items = computed(():BubbleListProps['items'] =>
  messages.value.flatMap((record) => {
    let items:any[] = []
    let procedures:any[] = []
    if (record.AgentThought?.Procedures?.length||0 > 0) {
      procedures = [...procedures, ...record.AgentThought?.Procedures?.map((proc, index) => ({
          key: (record['RecordId'] || '') + '-thought-' + index,
          title: proc.Title||'已思考',
          description: proc.TargetAgentName,
          content: renderMarkdown(proc.Debugging?.DisplayContent || proc.Debugging?.Content || ''),
        }))!]
    }
    if (procedures.length||0 > 0) {
      items.push({
        key: record['RecordId'] || '',
        loading: false,
        role: 'thought',
        content: procedures,
      })
    }
    items.push({
      key: record['RecordId'] || '',
      loading: record['Content']=='',
      role: record['IsLlmGenerated'] ? 'agent' : 'user',
      content: record,
      footer: renderFooter,
      avatar: isSelection.value ? <Checkbox value={record['RecordId']}></Checkbox> : <></>,
      messageRender: renderRecord,
    })
    return items
  })
)

// thought-chain
const expandedKeysUser = reactive([] as string[])
const onExpand = (keys: string[]) => {
  expandedKeysUser.splice(0, expandedKeysUser.length, ...keys)
}
// 展开的思维链：用户点击展开 或者 “思考中”
// expanded thought-chain: user click to expand or "Thinking"
const expandedKeys = computed(():string[] => {
  let ids = messages.value.flatMap((record):string[] => {
    let arr:any[] = []
    arr = arr.concat(record.AgentThought?.Procedures?.map((proc, index) => (
      proc.Status == 'processing' ? (record['RecordId'] || '') + '-thought-' + index : undefined
    )))
    arr = arr.concat(record.TokenStat?.Procedures?.map((proc, index) => (
      proc.Status == 'processing' ? (record['RecordId'] || '') + '-stat-' + index : undefined
    )))
    // remove undefined
    const filtered = arr?.filter((item): item is string => item !== undefined) || []
    return filtered
  })
  return [...expandedKeysUser, ...ids]
})

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
  messages.value = []
  if (!conversationId.value && !shareId) {
    if (applications.value.length > 0) {
      currentApplicationId.value = applications.value[0].AppBizId
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

  // scroll to bottom
  await nextTick()
  if (messages.value.length > 0) {
    const newest = messages.value[messages.value.length - 1].RecordId
    listRef.value?.scrollTo({ key: newest, block: 'end', behavior: 'instant' })
  }
}
watch(() => [conversationId.value, shareId], handleUpdate, { immediate: true })

let abort = null as AbortController|null
const handleSend = async (_lastQuery = null as null|string) => {
  senderLoading.value = true
  recording.value = false

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
  await nextTick()
  checkAutoScroll()

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

        // 自动滚动到底部，不要太频繁的滚动，否则无法捕获用户滑动操作
        const ts = new Date().getTime()
        if (ts - scrollOnMsgTs.value > 100) {
          scrollOnMsgTs.value = ts
          checkAutoScroll()
        }
      }
      // console.log(msg_map)
    }
  } catch (e) {
    console.log(e)
  }

  checkAutoScroll()

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
    await navigator.clipboard.writeText(content)
    message.info(`${tips}复制成功`)
  } else {
    message.error(`复制失败（请使用https协议部署！）`)
  }
}
const handleCopy = async (record: Record) => {
  await doCopy(record.Content || '')
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
    message.error(`${file.name} is not allowed`)
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

  if (scrollOnMsgCount.value > 0) {
    scrollOnMsgCount.value = 0
    return
  }

  scrollReachEnd.value = distance <= AUTO_SCROLL_TOLERANCE
  // console.log(distance)
}
// auto scroll on message
const checkAutoScroll = () => {
  if (scrollReachEnd.value) {
    scrollOnMsgCount.value += 1
    listRef.value?.scrollTo({ key: messages.value[messages.value.length-1].RecordId, block: 'end', behavior: 'instant' })
  }
}
</script>

<template>
  <a-layout-header id="chat-header">
    <slot name="header"></slot>

    <a-select v-model:value="currentApplicationId" style="width: 200px; margin: 0 auto" id="agent-select" :disabled="!!conversationId || !!shareId">
      <a-select-option v-for="application in applications" :value="application['AppBizId']">{{'BaseConfig' in application ? application['BaseConfig']['Name'] : '智能体(信息获取失败)'}}</a-select-option>
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
      </checkbox-group>
      <flex class="share-panel" v-if="isSelection">
        <div class="share-panel-space"/>
        <a-button @click="handleShare">分享</a-button>
        <a-button @click="isSelection=false">取消</a-button>
        <div class="share-panel-space"/>
      </flex>
      <sender
        v-if="!isSelection && !shareId"
        :loading="senderLoading"
        :value="query"
        :on-change="setQuery"
        :allow-speech="speechConfig"
        :on-submit="() => {
          handleSend()
          setQuery('')
        }"
        :on-cancel="() => {
          handleStop()
        }"
      >
        <template #prefix>
          <a-upload
            v-model:file-list="fileList"
            :before-upload="handleFile"
            list-type="picture"
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
.ant-thought-chain-item-header {
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
  padding: 0 24px 24px 24px;
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
}
.ant-bubble-end .ant-bubble-content-filled {
  background-color: cornflowerblue;
}
.ant-bubble-end .ant-bubble-content-filled p {
  color: white;
}
</style>
