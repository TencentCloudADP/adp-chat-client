<script setup lang="ts">
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const { openChat, closeChat, isFullscreen } = useChat({
  getConfig: ({ isFullscreen }) => ({
    modelType: 'compact',
    width: 400,
    height: isFullscreen ? 'calc(100vh - 40px)' : 640,
    logoTitle: 'ADP Chat',
    showFullscreenButton: true,
    showToggleButton: true,
  }),
})
</script>

<template>
  <div class="page-container bg-gradient-gray">
    <div class="popup-content">
      <h1>Popup Mode Demo</h1>
    </div>
    <div id="chat-container" :class="{ 'chat-container--fullscreen': isFullscreen }"></div>
  </div>
</template>

<style scoped>
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

#chat-container.chat-container--fullscreen {
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: auto;
  height: auto;
}
</style>