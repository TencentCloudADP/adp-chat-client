<script setup lang="tsx">
import { theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { computed, ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import Chat from './Chat.vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'
import { dateFormat, dateGroup } from '@/util/dateFormat'
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
    if (conversations.value.length > 0) {
      const activateTimeout = 3600
      const now = new Date().getTime() / 1000
      const lastActive = now - conversations.value[0].LastActiveAt
 
      if (lastActive < activateTimeout && !conversationId.value) {
        console.log(`[update] redirect to activate conversation, lastActive: ${lastActive}, ${now}, ${conversations.value[0].LastActiveAt}`)
        conversationId.value = conversations.value[0].Id
      }
    }
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
  ).sort((a: ChatConversation, b: ChatConversation) => b.LastActiveAt - a.LastActiveAt)
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

const groupable: ConversationsProps['groupable'] = {
  title: (group, { components: { GroupTitle } }) =>
    <div class="conversation-list-title"><span>{group}</span></div>
};
const converdationItems = computed(() =>
  conversations.value.map((conversation) => ({
    key: conversation['Id'] || '',
    label: <div class="item-box"><span>{conversation['Title']}</span><div class="item-space" /><span class="item-end">{dateFormat(new Date(conversation['LastActiveAt']*1000), 'HH:mm')}</span></div>,
    disabled: false,
    group: dateGroup(conversation['LastActiveAt']),
  }))
)

</script>

<template>
  <a-layout-sider id="conversion-panel" width="256" collapsedWidth="0" v-model:collapsed="collapsed" :trigger="null" collapsible>
    <Flex vertical id="conversion-panel-flex">
      <Conversations
          :items="converdationItems"
          :groupable="groupable"
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

<style>
.item-box {
  display: flex;
}
.item-space {
  flex-grow: 1;
}
.item-end {
  color: #00000055 !important;
}
.conversation-list-title {
  color: gray;
  padding: 8px;
}
#conversion-list li {
  list-style: none;
}
.ant-conversations .ant-conversations-list .ant-conversations-item {
  padding-inline-start: 8px;
}
.ant-conversations .ant-conversations-list .ant-conversations-item span {
  color: inherit;
}
.ant-conversations-list {
  margin-bottom: 16px;
}
</style>

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
  margin-right: 6px;
}
#conversation-new {
  margin: 15px;
}
#conversion-list {
  width: 250px;
  flex-grow: 1;
  margin: 0;
  overflow: scroll;
  padding: 6px;
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
