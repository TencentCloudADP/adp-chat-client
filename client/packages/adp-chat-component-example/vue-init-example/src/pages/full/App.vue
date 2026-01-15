<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ADPChatComponent from 'adp-chat-component'

let instance: any = null
const isOpen = ref(false)

const initChat = () => {
  if (instance) {
    try {
      ADPChatComponent.unmount('chat-container-app')
    } catch (e) {
      // ignore
    }
  }

  instance = ADPChatComponent.init('#chat-container', {
    modelType: 'full',
    theme: 'light',
    logoTitle: 'ADP Chat - Full Mode',
    showFullscreenButton: false,
    open: isOpen.value,
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话',
    sideI18n: {
      more: '更多',
      collapse: '收起',
      today: '今天',
      recent: '最近',
      switchTheme: '切换主题',
      selectLanguage: '选择语言',
      logout: '退出登录',
    },
    chatI18n: {
      loading: '加载中...',
      thinking: '思考中...',
      sendError: '发送失败',
      networkError: '网络错误',
    },
    chatItemI18n: {
      thinking: '思考中',
      copy: '复制',
      replay: '重新生成',
      share: '分享',
      good: '有帮助',
      bad: '没帮助',
    },
    senderI18n: {
      placeholder: '请输入您的问题...',
      uploadImg: '上传图片',
      answering: '回答中...',
    },
    onOpenChange: (open: boolean) => {
      console.log('Open state changed:', open)
      isOpen.value = open
    },
  })
}

const openChat = () => {
  isOpen.value = true
  initChat()
}

const closeChat = () => {
  isOpen.value = false
  initChat()
}

onMounted(() => {
  initChat()
})

onUnmounted(() => {
  if (instance) {
    try {
      ADPChatComponent.unmount('chat-container-app')
    } catch (e) {
      // ignore
    }
  }
})
</script>

<template>
  <div class="page-container">
    <div v-if="!isOpen" class="control-panel">
      <h2>Full Mode Demo</h2>
      <p>Chat panel is closed</p>
      <div class="control-buttons">
        <button class="control-btn" @click="openChat">Open Chat</button>
      </div>
    </div>
    <div id="chat-container" class="chat-container"></div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.page-container {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-panel {
  position: absolute;
  text-align: center;
  z-index: 1;
}

.control-panel h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.control-panel p {
  color: #666;
  margin-bottom: 16px;
}

.control-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.control-btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #1890ff;
  color: #fff;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #40a9ff;
}

#chat-container {
  width: 100%;
  height: 100%;
}
</style>
