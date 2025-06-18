<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { Flex } from 'ant-design-vue'
import { Bubble, Sender, type BubbleListProps } from 'ant-design-x-vue'
import { ref, reactive, computed } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import type { ChatMessage } from '@/model/message'

const roles: BubbleListProps['roles'] = {
  agent: {
    placement: 'start',
    avatar: { icon: UserOutlined, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: UserOutlined, style: { background: '#87d068' } },
  },
}

const query = ref("")
const senderLoading = ref(false)
const messages = reactive([] as {'messageId':null, 'delta':string}[])
const setContent = (v: string) => {
  query.value = v
}

const handleSend = async () => {
  senderLoading.value = true
  const post_body = {
    query: query.value
  }
  const options = {
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 1000 * 600,
  } as AxiosRequestConfig
  try {
    const res = await api.post('/chat/message', post_body, options)

    let last_messages = {'messageId': null, 'delta': ''}
    for await (const line of chunkSplitter(res.data)) {
      let msg_body = line.substring(line.indexOf(':')+1).trim()
      let msg = JSON.parse(msg_body)
      if (msg['type'] == 'TEXT_MESSAGE_CONTENT') {
        if (last_messages['messageId'] != msg['messageId']) {
          last_messages = msg
          messages.push(last_messages)
        } else {
          last_messages['delta'] += msg['delta']
        }
      } else if (msg['type'] == 'CUSTOM' && msg['name'] == 'thought') {
        if (last_messages['messageId'] != msg['value']['messageId']) {
          last_messages = msg['value']
          messages.push(last_messages)
        } else {
          last_messages['delta'] += msg['value']['delta']
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
        content: message['delta'],
      }))"
    />
    <Sender
      :loading="senderLoading"
      :value="query"
      :on-change="setContent"
      :on-submit="() => {
        handleSend()
        setContent('')
      }"
    />
  </Flex>
</template>
