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
  PlusSquareOutlined,
} from '@ant-design/icons-vue'

defineOptions({ name: 'AXConversationsBasic' });

const isMobile = (window.innerWidth < 512)
const collapsed = ref(false)
const conversations = ref([] as {'id':null, 'agent_id': string, 'title':string, 'last_active_at':string}[])
const activeConversationId = ref(undefined as string|undefined)

const emit = defineEmits<{
  logout: []
}>()

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
  currentAgentId.value = agents.value[0]['AppBizId']
}

const handleOnNewConversation = async (converdation_id: string) => {
  await handleUpdate()
  activeConversationId.value = converdation_id
}

const currentAgentId = ref(undefined as string|undefined)
const agents = ref([])
const handleLoadAgent = async () => {
    const res = await api.get('/agent/list', {})
    if (res.data.agents) {
        agents.value = res.data.agents
        if (currentAgentId.value === undefined) {
            currentAgentId.value = agents.value[0]['AppBizId']
        }
    }
}

onBeforeMount(() => {
  if (isMobile) {
    collapsed.value = true
  }
})
onMounted(async () => {
  await handleLoadAgent()
  await handleUpdate()
})

const updateActiveKey = (v: string) => {
  // 如果是移动设备，选择会话后，自动收起会话列表
  // collapse conversation list when select a conversation on mobile device
  if (isMobile) {
    collapsed.value = true
  }
  
  activeConversationId.value = v
  conversations.value.forEach((conversation) => {
    if (conversation['id'] === v) {
      currentAgentId.value = conversation['agent_id']
    }
  })
}

</script>

<template>
  <a-layout-sider id="conversion-panel" width="256" collapsedWidth="0" v-model:collapsed="collapsed" :trigger="null" collapsible>
    <Flex vertical id="conversion-panel-flex">
      <a-button @click="handleCreateConversation" id="conversation-new">新会话</a-button>
      <Conversations
          :items="conversations.map((conversation) => ({
            key: conversation['id'] || '',
            label: `${conversation['title']} ${conversation['last_active_at'].substring(5, 16)}`,
            disabled: false,
          }))"
          :active-key="activeConversationId"
          :on-active-change="(v) => updateActiveKey(v)"
          id="conversion-list"
      />
      <a-button id="logout" @click="emit('logout')">退出</a-button>
    </Flex>
  </a-layout-sider>
  <a-layout id="chat-panel">
    <a-layout-header id="chat-header">
      <menu-unfold-outlined
        v-if="collapsed"
        class="chat-header-btn"
        @click="() => (collapsed = !collapsed)"
      />
      <menu-fold-outlined v-else class="chat-header-btn" @click="() => (collapsed = !collapsed)" />

      <a-select v-model:value="currentAgentId" style="width: 200px; margin: 0 auto" id="agent-select" :disabled="!!activeConversationId">
        <a-select-option v-for="agent in agents" :value="agent['AppBizId']">{{'BaseConfig' in agent ? agent['BaseConfig']['Name'] : '智能体(信息获取失败)'}}</a-select-option>
      </a-select>

      <plus-square-outlined class="chat-header-btn" @click="handleCreateConversation" />
    </a-layout-header>
    <a-layout-content id="chat">
      <Chat
        :conversationId="activeConversationId"
        :agentId="currentAgentId"
        @newConversation="handleOnNewConversation"
      />
    </a-layout-content>
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
#chat {
  background: #fff;
  padding: 0 24px 24px 24px;
  margin: 0;
  min-height: 150px;
}

.site-layout-background {
  background: #fff;
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

</style>
