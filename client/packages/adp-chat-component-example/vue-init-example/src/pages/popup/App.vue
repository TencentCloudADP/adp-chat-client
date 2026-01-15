<script setup lang="ts">
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const { openChat, closeChat } = useChat({
  getConfig: ({ isFullscreen }) => ({
    canPark: true,
    modelType: 'compact',
    width: isFullscreen ? '100%' : 420,
    height: isFullscreen ? '100%' : 620,
    logoTitle: 'ADP Chat',
    showFullscreenButton: true,
    showToggleButton: false,
  }),
})
</script>

<template>
  <div class="page-container bg-gradient-gray">
    <div class="popup-content">
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

<style scoped>
.popup-content {
  text-align: center;
  padding: 40px;
}

.popup-content h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 700;
}

.popup-content p {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 8px;
}

.feature-list {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 32px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 1.75rem;
}

.feature-item span:last-child {
  font-size: 0.875rem;
  color: #64748b;
}

.control-buttons {
  margin-top: 24px;
}
</style>
