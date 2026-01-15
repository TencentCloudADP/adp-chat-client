<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ADPChatComponent from 'adp-chat-component'

let instance: any = null
const isFullscreen = ref(false)
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
    modelType: 'compact',
    width: isFullscreen.value ? '100%' : 800,
    height: isFullscreen.value ? '100%' : 600,
    theme: 'light',
    logoTitle: 'ADP Chat - Compact',
    showFullscreenButton: true,
    isFullscreen: isFullscreen.value,
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
    },
    chatItemI18n: {
      thinking: '思考中',
      copy: '复制',
    },
    senderI18n: {
      placeholder: '请输入问题...',
    },
    onFullscreen: (fullscreen: boolean) => {
      if (fullscreen) {
        isFullscreen.value = true
      } else {
        isFullscreen.value = false
      }
      initChat()
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
  <div class="page-container" :class="{ 'is-fullscreen': isFullscreen }">
    <div v-if="!isOpen" class="control-panel">
      <h2>Compact Mode Demo</h2>
      <p>Chat panel is closed</p>
      <div class="control-buttons">
        <button class="control-btn" @click="openChat">Open Chat</button>
      </div>
    </div>
    <div class="chat-wrapper" :class="{ 'fullscreen-expanded': isFullscreen }">
      <div id="chat-container"></div>
    </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  transition: padding 0.3s ease;
}

.page-container.is-fullscreen {
  padding: 0;
}

.control-panel {
  position: absolute;
  text-align: center;
  z-index: 1;
}

.control-panel h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 8px;
}

.control-panel p {
  color: rgba(255, 255, 255, 0.8);
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
  background: #fff;
  color: #667eea;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f0f0f0;
}

.chat-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

#chat-container {
    width: 100%;
    height: 100%;
}

.chat-wrapper.fullscreen-expanded {
  width: 100%;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
}
</style>
