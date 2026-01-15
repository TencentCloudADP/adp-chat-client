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
    canPark: true,
    modelType: 'compact',
    width: isFullscreen.value ? '100%' : 420,
    height: isFullscreen.value ? '100%' : 620,
    theme: 'light',
    logoTitle: 'ADP Chat',
    showFullscreenButton: true,
    showToggleButton: false,
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
      // 关闭时重新初始化以更新状态
      if (!open) {
        initChat()
      }
    },
  })
}

// 外部控制打开
const openChat = () => {
  isOpen.value = true
  initChat()
}

// 外部控制关闭
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
    <div class="content">
      <h1>Popup Mode Demo</h1>
      <p>Click the chat button at the bottom right corner to open the chat window</p>
      <p>This mode is suitable for embedding chat functionality in existing pages</p>
      <div class="control-buttons">
        <button class="control-btn" @click="openChat">Open Chat</button>
        <button class="control-btn control-btn--secondary" @click="closeChat">Close Chat</button>
      </div>
      <div class="feature-list">
        <div class="feature-item">
          <span class="feature-icon">💬</span>
          <span>Floating Button</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📱</span>
          <span>Fixed Position Popup</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✨</span>
          <span>Closable & Minimizable</span>
        </div>
      </div>
    </div>
    <div id="chat-container"></div>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

#chat-container {
    width: 100%;
    height: 100%;
}

.content {
  text-align: center;
  padding: 40px;
}

.content h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 16px;
}

.content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 8px;
}

.feature-list {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 40px;
}

.control-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
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

.control-btn--secondary {
  background: #f5f5f5;
  color: #666;
}

.control-btn--secondary:hover {
  background: #e8e8e8;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2rem;
}

.feature-item span:last-child {
  font-size: 0.9rem;
  color: #666;
}
</style>
