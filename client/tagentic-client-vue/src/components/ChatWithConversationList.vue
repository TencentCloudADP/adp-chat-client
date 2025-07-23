<script setup lang="ts">
import { theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { computed, ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import Chat from './Chat.vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import { dateFormat } from '@/util/dateFormat'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'
import type { ChatConversation } from '@/model/conversation';

defineOptions({ name: 'AXConversationsBasic' });

const isMobile = (window.innerWidth < 512)
const collapsed = ref(false)
const conversations = ref([] as ChatConversation[])

const emit = defineEmits<{
  logout: []
}>()

const conversationId = defineModel('conversationId', { type: String })

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

const handleOnNewConversation = async (converdation_id: string) => {
  await handleUpdate()
  conversationId.value = converdation_id
}

const handleOnConversationUpdate = async (conversation: ChatConversation) => {
  conversations.value = conversations.value.map(conv => 
    conv.Id == conversation.Id ? conversation : conv
  )
}

onBeforeMount(() => {
  if (isMobile) {
    collapsed.value = true
  }
})
onMounted(async () => {
  await handleUpdate()
})

const updateActiveKey = (v: string) => {
  // 如果是移动设备，选择会话后，自动收起会话列表
  // collapse conversation list when select a conversation on mobile device
  if (isMobile) {
    collapsed.value = true
  }

  conversationId.value = v
  console.log(`[updateActiveKey] conversationId changed to ${v}`)  
}

</script>

<template>
  <a-layout-sider id="conversion-panel" width="256" collapsedWidth="0" v-model:collapsed="collapsed" :trigger="null" collapsible>
    <Flex vertical id="conversion-panel-flex">
      <Conversations
          :items="conversations.map((conversation) => ({
            key: conversation['Id'] || '',
            label: `${conversation['Title']} ${conversation['LastActiveAt'].substring(5, 16)}`,
            disabled: false,
          }))"
          :active-key="conversationId"
          :on-active-change="(v) => updateActiveKey(v)"
          id="conversion-list"
      />
      <a-button id="logout" @click="emit('logout')">退出</a-button>
    </Flex>
  </a-layout-sider>
  <a-layout id="chat-panel">
    <chat
      v-model:conversationId="conversationId"
      @newConversation="handleOnNewConversation"
      @conversationUpdate="handleOnConversationUpdate"
    >
      <template v-slot:header>
        <menu-unfold-outlined
        v-if="collapsed"
        class="chat-header-btn"
        @click="() => (collapsed = !collapsed)"
      />
        <menu-fold-outlined v-else class="chat-header-btn" @click="() => (collapsed = !collapsed)" />
      </template>
    </chat>
  </a-layout>
</template>

<style scoped>
#conversion-panel {
  background: #f5f5f5;
}
#conversion-panel-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
  margin-right: 10px;
}
#conversation-new {
  margin: 15px;
}
#conversion-list {
  width: 256px;
  flex-grow: 1;
  margin: 0;
  overflow: scroll;
}
#logout {
  margin: 15px;
}
#chat-panel {
  min-width: 256px;
}
.site-layout-background {
  background: #fff;
}

</style>
