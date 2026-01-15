<script setup lang="ts">
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const { isOpen, isFullscreen, openChat } = useChat({
  getConfig: ({ isFullscreen }) => ({
    modelType: 'compact',
    width: isFullscreen ? '100%' : 800,
    height: isFullscreen ? '100%' : 600,
    logoTitle: 'ADP Chat - Fullscreen Demo',
    showFullscreenButton: true,
    onFullscreen: (fullscreen: boolean) => {
      if (!fullscreen) {
        window.close()
      }
    },
  }),
})
</script>

<template>
  <div class="page-container bg-gradient-light" :class="{ 'is-fullscreen': isFullscreen }" :style="{ padding: isFullscreen ? 0 : '40px' }">
    <div v-if="!isOpen" class="control-panel">
      <h2>Fullscreen Demo</h2>
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
