<script setup lang="ts">
import { useChat } from './shared/useChat'
import './shared/styles.css'

const { isOverlay, isOpen } = useChat({
  getConfig: ({ isOverlay }) => ({
    width: 400,
    height: '80vh',
    isOverlay: isOverlay,
    logoTitle: 'ADP Chat',
    showOverlayButton: true,
    showToggleButton: true,
  }),
})
</script>

<template>
  <div id="container">
    <div id="main">
      <div class="main-content">
        <h1>ADP Chat Demo</h1>
      </div>
    </div>
    <div id="chat-container" :class="{ 'chat-container--expanded': !isOverlay && isOpen }"></div>
  </div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
}

#chat-container {
  position: relative;
  height: 100vh;
  flex-shrink: 0;
  width: 0;
  transition: width 0.3s ease;
}

/* 弹出模式：覆盖在container上 */
/* 非浮层模式：和container分享页面宽度 */
#chat-container.chat-container--expanded {
  width: 500px;
}

#chat-container :deep(*) {
  pointer-events: auto;
}

#main {
  flex-grow: 1;
  width: 100%;
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

@media (max-width: 768px) {
  .main-content h1 {
    font-size: 1.75rem;
  }
}
</style>
