<script setup lang="ts">
import { useChat } from './shared/useChat'
import './shared/styles.css'

const { isFullscreen } = useChat({
  getConfig: ({ isFullscreen }) => ({
    modelType: 'compact',
    width: 420,
    height: isFullscreen ? '100vh' : 600,
    logoTitle: 'ADP Chat',
    showFullscreenButton: true,
    showToggleButton: true,
  }),
})
</script>

<template>
  <div id="container" :class="{ 'container--fullscreen': isFullscreen }">
    <div id="main">
      <div class="main-content">
        <h1>ADP Chat Demo</h1>
      </div>
    </div>
    <div id="chat-container" :class="{ 'chat-container--fullscreen': isFullscreen }"></div>
  </div>
</template>

<style scoped>
#container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#container.container--fullscreen {
  display: flex;
  flex-direction: row;
}

#main {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.main-content {
  text-align: center;
  max-width: 600px;
}

.main-content h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-weight: 700;
}

.main-content p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* 默认：浮层半屏模式 */
#chat-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  top: auto;
  left: auto;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

#chat-container :deep(*) {
  pointer-events: auto;
}

/* 全屏：挤压布局 */
#chat-container.chat-container--fullscreen {
  position: static;
  width: fit-content;
  height: 100vh;
  flex-shrink: 0;
  pointer-events: auto;
  display: block;
}

@media (max-width: 768px) {
  .main-content h1 {
    font-size: 1.75rem;
  }
}
</style>
