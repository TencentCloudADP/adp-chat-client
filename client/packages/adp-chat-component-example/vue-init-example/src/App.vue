<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ADPChatComponent from 'adp-chat-component'

type DemoType = 'full' | 'compact' | 'popup' | 'multi'

const currentDemo = ref<DemoType>('full')
let instances: any[] = []

const demos = [
  { key: 'full', name: 'Full Mode', desc: '全屏模式' },
  { key: 'compact', name: 'Compact Mode', desc: '紧凑模式' },
  { key: 'popup', name: 'Popup Mode', desc: '弹窗模式' },
  { key: 'multi', name: 'Multi Instance', desc: '多实例' },
]

// 清理所有实例
const clearInstances = () => {
  instances.forEach((_, index) => {
    try {
      ADPChatComponent.unmount(`demo-container-${index}-app`)
    } catch (e) {
      // ignore
    }
  })
  instances = []
  
  // 清理可能存在的容器
  const containers = ['chat-full', 'chat-compact', 'chat-popup', 'instance-1', 'instance-2']
  containers.forEach(id => {
    try {
      ADPChatComponent.unmount(`${id}-app`)
    } catch (e) {
      // ignore
    }
  })
}

// 初始化 Full Mode
const initFullMode = () => {
  const instance = ADPChatComponent.init('#chat-full', {
    modelType: 'full',
    theme: 'light',
    logoTitle: 'ADP Chat - Full Mode',
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
  })
  if (instance) instances.push(instance)
}

// 初始化 Compact Mode
const initCompactMode = () => {
  const instance = ADPChatComponent.init('#chat-compact', {
    modelType: 'compact',
    width: 800,
    height: 600,
    theme: 'light',
    logoTitle: 'ADP Chat - Compact',
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
  })
  if (instance) instances.push(instance)
}

// 初始化 Popup Mode
const initPopupMode = () => {
  const instance = ADPChatComponent.init('#chat-popup', {
    canPark: true,
    modelType: 'compact',
    width: 420,
    height: 620,
    theme: 'light',
    logoTitle: 'ADP Chat',
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
  })
  if (instance) instances.push(instance)
}

// 初始化 Multi Instance
const initMultiInstance = () => {
  // 实例1: 亮色主题
  const instance1 = ADPChatComponent.init('#instance-1', {
    modelType: 'full',
    theme: 'light',
    logoTitle: 'Light Theme',
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话',
    sideI18n: {
      more: '更多',
      collapse: '收起',
      today: '今天',
      recent: '最近',
    },
    chatI18n: {
      loading: '加载中...',
      thinking: '思考中...',
    },
    senderI18n: {
      placeholder: '请输入问题...',
    },
  })
  if (instance1) instances.push(instance1)

  // 实例2: 暗色主题
  const instance2 = ADPChatComponent.init('#instance-2', {
    modelType: 'full',
    theme: 'dark',
    logoTitle: 'Dark Theme',
    aiWarningText: 'AI generated content',
    createConversationText: 'New Chat',
    sideI18n: {
      more: 'More',
      collapse: 'Collapse',
      today: 'Today',
      recent: 'Recent',
    },
    chatI18n: {
      loading: 'Loading...',
      thinking: 'Thinking...',
    },
    senderI18n: {
      placeholder: 'Type your question...',
    },
  })
  if (instance2) instances.push(instance2)
}

// 初始化当前 Demo
const initCurrentDemo = async () => {
  clearInstances()
  await nextTick()
  
  switch (currentDemo.value) {
    case 'full':
      initFullMode()
      break
    case 'compact':
      initCompactMode()
      break
    case 'popup':
      initPopupMode()
      break
    case 'multi':
      initMultiInstance()
      break
  }
}

// 切换 Demo
const switchDemo = (key: DemoType) => {
  if (currentDemo.value === key) return
  currentDemo.value = key
}

watch(currentDemo, () => {
  initCurrentDemo()
})

onMounted(() => {
  initCurrentDemo()
})

onUnmounted(() => {
  clearInstances()
})
</script>

<template>
  <div class="demo-app">
    <!-- 顶部导航 -->
    <header class="demo-header">
      <h1 class="demo-title">ADP Chat Component Demo</h1>
      <nav class="demo-tabs">
        <button 
          v-for="demo in demos" 
          :key="demo.key"
          :class="['tab-btn', { active: currentDemo === demo.key }]"
          @click="switchDemo(demo.key as DemoType)"
        >
          {{ demo.name }}
        </button>
      </nav>
    </header>

    <!-- Demo 内容区 -->
    <main class="demo-content">
      <!-- Full Mode -->
      <div v-show="currentDemo === 'full'" class="demo-panel demo-full">
        <div id="chat-full" class="chat-container"></div>
      </div>

      <!-- Compact Mode -->
      <div v-show="currentDemo === 'compact'" class="demo-panel demo-compact">
        <div class="compact-wrapper">
          <div id="chat-compact" class="chat-wrapper"></div>
        </div>
      </div>

      <!-- Popup Mode -->
      <div v-show="currentDemo === 'popup'" class="demo-panel demo-popup">
        <div class="popup-content">
          <h2>弹窗模式演示</h2>
          <p>点击右下角的聊天按钮打开聊天窗口</p>
          <p>此模式适用于在现有页面中嵌入聊天功能</p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">💬</span>
              <span>悬浮按钮触发</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <span>固定位置弹窗</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>可关闭和最小化</span>
            </div>
          </div>
        </div>
        <div id="chat-popup"></div>
      </div>

      <!-- Multi Instance -->
      <div v-show="currentDemo === 'multi'" class="demo-panel demo-multi">
        <div class="multi-container">
          <div class="instance-wrapper">
            <div class="instance-header">实例 1 - 亮色主题 (Light Theme)</div>
            <div id="instance-1" class="instance-content"></div>
          </div>
          <div class="instance-wrapper">
            <div class="instance-header">实例 2 - 暗色主题 (Dark Theme)</div>
            <div id="instance-2" class="instance-content"></div>
          </div>
        </div>
      </div>
    </main>
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
.demo-app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* Header */
.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.demo-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.demo-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #0052d9;
  color: #0052d9;
}

.tab-btn.active {
  background: #0052d9;
  border-color: #0052d9;
  color: #fff;
}

/* Content */
.demo-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.demo-panel {
  width: 100%;
  height: 100%;
}

/* Full Mode */
.demo-full .chat-container {
  width: 100%;
  height: 100%;
}

/* Compact Mode */
.demo-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
}

.compact-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Popup Mode */
.demo-popup {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.popup-content {
  text-align: center;
  padding: 40px;
}

.popup-content h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 16px;
}

.popup-content p {
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

/* Multi Instance */
.demo-multi {
  padding: 24px;
  background: #f0f0f0;
}

.multi-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  height: 100%;
}

.instance-wrapper {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.instance-header {
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  flex-shrink: 0;
}

.instance-content {
  flex: 1;
  position: relative;
  min-height: 0;
}
</style>
