<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { Flex } from 'ant-design-vue'
import { Bubble, Sender, ThoughtChain, type BubbleListProps, type BubbleProps } from 'ant-design-x-vue'
import { Typography } from 'ant-design-vue'
import { ref, reactive, watch, computed, h } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import markdownit from 'markdown-it'
import type { Message, ReplyMessage } from '@/model/message'
import type { Record } from '@/model/record'
import { messageToRecord, mergeRecord } from '@/model/record'


const roles: BubbleListProps['roles'] = {
  agent: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
    style: {
      // maxWidth: '600px',
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
  },
}

const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  })

const emit = defineEmits<{
  new_conversation: [conversation_id: string]
}>()

const { conversationId = null } = defineProps<{
  conversationId?: string,
}>()

const query = ref("")
const senderLoading = ref(false)
const messages = ref([] as Record[])
const setQuery = (v: string) => {
  query.value = v
}
// thought-chain
const expandedKeysUser = reactive([] as string[])
const onExpand = (keys: string[]) => {
  expandedKeysUser.splice(0, expandedKeysUser.length, ...keys)
}
// 展开的思维链：用户点击展开 或者 “思考中”
// expanded thought-chain: user click to expand or "Thinking"
const expandedKeys = computed(():string[] => {
  let ids = messages.value.flatMap((record):string[] => {
    let items:string[] = []
    if (record.AgentThought?.Procedures?.length||0 > 0) {
      // TODO: filter by some key instead of '思考中'
      const arr = record.AgentThought?.Procedures?.map((proc, index) => (
        proc.Title == '思考中' ? (record['RecordId'] || '') + '-' + index : undefined
      ))
      // remove undefined
      const filtered = arr?.filter((item): item is string => item !== undefined) || []
      if (filtered?.length||0 > 0) {
        items = [...items, ...filtered]
      }
    }
    return items
  })
  return [...expandedKeysUser, ...ids]
})

const handleUpdate = async () => {
  if (!conversationId) {
    messages.value = []
    return
  }
  const options = {
    params: {
      conversation_id: conversationId,
    }
  } as AxiosRequestConfig
  try {
    const res = await api.get('/chat/messages', options)
    // console.log(res)
    messages.value = res.data.Response.Records
  } catch (e) {
    console.log(e)
  }
}
watch(() => conversationId, handleUpdate)

const handleSend = async () => {
  senderLoading.value = true
  const post_body = {
    query: query.value,
    conversation_id: conversationId,
  }
  const options = {
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 1000 * 600,
  } as AxiosRequestConfig
  try {
    const res = await api.post('/chat/message', post_body, options)

    let last_messages = {'messageId': null, 'delta': '', 'content': ''}
    for await (const line of chunkSplitter(res.data)) {
      let msg_body = line.substring(line.indexOf(':')+1).trim()
      let msg_map = JSON.parse(msg_body)
      if (msg_map['type'] == 'custom' && msg_map['name'] == 'new_conversation') {
          let converdation_id = msg_map['value']['conversation_id']
          emit('new_conversation', converdation_id)
      } else {
        let msg: Message = msg_map
        let record = messageToRecord(msg)
        if (record == null) {
          continue
        }

        const lastIndex = messages.value.length - 1
        if (lastIndex >= 0 && messages.value[lastIndex].RecordId == record.RecordId) {
          mergeRecord(messages.value[lastIndex], msg)
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

</script>

<template>
  <Flex
    vertical
    :style="{ 'height': '100%' }"
    gap="middle"
  >
    <Bubble.List
      :roles="roles"
      :autoScroll="true"
      :style="{ 'flex-grow': 1 }"
      :items="messages.flatMap((record) => {
        let items:any[] = []
        if (record.AgentThought?.Procedures?.length||0 > 0) {
          items.push({
            key: record['RecordId'] || '',
            loading: false,
            role: 'thought',
            content: record.AgentThought?.Procedures?.map((proc, index) => ({
              key: (record['RecordId'] || '') + '-' + index,
              title: proc.Title||'已思考',
              description: proc.TargetAgentName,
              content: renderMarkdown(proc.Debugging?.Content || ''),
            })),
          })
        }
        items.push({
          key: record['RecordId'] || '',
          loading: false,
          role: record['IsLlmGenerated'] ? 'agent' : 'user',
          content: record['Content'],
          messageRender: renderMarkdown,
        })
        return items
      })"
    />
    <Sender
      :loading="senderLoading"
      :value="query"
      :on-change="setQuery"
      :on-submit="() => {
        handleSend()
        setQuery('')
      }"
    />
  </Flex>
</template>
