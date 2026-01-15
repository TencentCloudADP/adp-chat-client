<script setup lang="ts">
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const { isOpen, openChat } = useChat({
  getConfig: () => ({
    modelType: 'full',
    logoTitle: 'ADP Chat - Full Mode',
    showFullscreenButton: false,
  }),
})
</script>

<template>
  <div class="page-container bg-plain">
    <div v-if="!isOpen" class="control-panel">
      <h2>Full Mode Demo</h2>
      <p>Chat panel is closed</p>
      <div class="control-buttons">
        <button class="control-btn" @click="openChat">Open Chat</button>
      </div>
    </div>
    <div id="chat-container"></div>
  </div>
</template>
