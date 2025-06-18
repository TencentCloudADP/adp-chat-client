<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('access_token')
})

</script>

<template>
  <a-layout id="root-layout">
    <a-layout-header class="header">
      <div class="logo" />
    </a-layout-header>
    <a-layout>
      <Login v-if="!isAuthenticated" />
      <Chat v-else />
    </a-layout>
  </a-layout>
</template>

<style scoped>
.site-layout-background {
  background: #fff;
}
#root-layout {
  height: 100%;
}
</style>
