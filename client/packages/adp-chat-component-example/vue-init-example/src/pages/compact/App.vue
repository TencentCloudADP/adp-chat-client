<script setup lang="ts">
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const { isOpen, isFullscreen, openChat } = useChat({
  getConfig: ({ isFullscreen }) => ({
    modelType: 'compact',
    width: isFullscreen ? '100%' : 800,
    height: isFullscreen ? '100%' : 600,
    logoTitle: 'ADP Chat - Compact',
    showFullscreenButton: true,
  }),
})
</script>

<template>
  <div class="page-container bg-gradient-purple" :class="{ 'is-fullscreen': isFullscreen }" :style="{ padding: isFullscreen ? 0 : '40px' }">
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
