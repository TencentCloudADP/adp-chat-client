<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { Flex } from 'ant-design-vue'
import { Bubble, Sender, type BubbleListProps } from 'ant-design-x-vue'
import { ref, reactive, watch, computed, h } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import type { ChatMessage } from '@/model/message'

const roles: BubbleListProps['roles'] = {
  agent: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
  },
}

const { conversationId = null } = defineProps<{
  conversationId?: string,
}>()

const query = ref("")
const senderLoading = ref(false)
// const messages = reactive([] as {'messageId':null, 'delta':string}[])
const messages = ref([] as {'messageId':null, 'content':string}[])
const setQuery = (v: string) => {
  query.value = v
}

const handleUpdate = async () => {
  const options = {
    params: {
      conversation_id: conversationId,
    }
  } as AxiosRequestConfig
  try {
    const res = await api.get('/chat/messages', options)
    messages.value = res.data
    console.log(res)
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
      let msg = JSON.parse(msg_body)
      if (msg['type'] == 'TEXT_MESSAGE_CONTENT') {
        if (last_messages['messageId'] != msg['messageId']) {
          last_messages = msg
          last_messages['content'] = msg['delta']
          messages.value.push(last_messages)
        } else {
          last_messages['content'] += msg['delta']
        }
      } else if (msg['type'] == 'CUSTOM' && msg['name'] == 'thought') {
        if (last_messages['messageId'] != msg['value']['messageId']) {
          last_messages = msg['value']
          last_messages['content'] = msg['value']['delta']
          messages.value.push(last_messages)
        } else {
          last_messages['content'] += msg['value']['delta']
        }
      }
      console.log(msg)
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
      :style="{ 'flex-grow': 1 }"
      :items="messages.map((message) => ({
        key: message['messageId'] || '',
        loading: false,
        role: 'user',
        content: message['content'],
      }))"
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
