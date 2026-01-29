<template>
  <div id="container">
    <div id="chat-window">
      <ADPChat
        theme="light"
        :isOverlay="false"
        :isSidePanelOverlay="true"
        logoTitle="ADP Chat"
        :showOverlayButton="false"
        :showCloseButton="false"
        :apiConfig="{ baseURL }"
        :autoLoad="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ADPChat, type Application } from 'adp-chat-component';

const isDev = import.meta.env.DEV;
const baseURL = isDev ? '/api' : './';

</script>
