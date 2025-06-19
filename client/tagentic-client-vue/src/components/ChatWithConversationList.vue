<script setup lang="ts">
import { theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { computed, ref, reactive, onMounted } from 'vue';
import Chat from './Chat.vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import { dateFormat } from '@/util/dateFormat'

defineOptions({ name: 'AXConversationsBasic' });

const conversations = ref([] as {'id':null, 'title':string, 'last_active_at':string}[])
const activeConversationId = ref(undefined as string|undefined)

const handleUpdate = async () => {
  const options = {
  } as AxiosRequestConfig
  try {
    const res = await api.get('/chat/conversations', options)
    conversations.value = res.data
    // console.log(res)
  } catch (e) {
    console.log(e)
  }
}

const handleCreateConversation = async () => {
  activeConversationId.value = undefined
}

const handleOnNewConversation = async (converdation_id: string) => {
  await handleUpdate()
  activeConversationId.value = converdation_id
}

onMounted(async () => {
  await handleUpdate()
})

const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '256px',
  height: '100%',
  overflow: 'scroll',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

const updateActiveKey = (v: string) => {
  activeConversationId.value = v
}

</script>

<template>
  <a-layout-sider width="256" style="background: #fff; padding-top: 10px;">
    <a-button @click="handleCreateConversation" style="width: calc(100% - 20px); margin: 0 10px;">新会话</a-button>
    <Conversations
        :items="conversations.map((conversation) => ({
          key: conversation['id'] || '',
          label: `${conversation['title']} ${conversation['last_active_at'].substring(5, 16)}`,
          disabled: false,
        }))"
        :active-key="activeConversationId"
        :on-active-change="(v) => updateActiveKey(v)"
        :style="style"
    />
  </a-layout-sider>
  <a-layout style="padding: 10px">
    <a-layout-content
      :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      <Chat
        :conversationId="activeConversationId"
        @new_conversation="handleOnNewConversation"
      />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
