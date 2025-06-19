<script setup lang="ts">
import { ref, reactive, computed, handleError } from 'vue'
import Chat from './components/ChatWithConversationList.vue'
import Login from './components/Login.vue'

const event = ref(false)

const isAuthenticated = computed(() => {
  return (!!localStorage.getItem('access_token')) ||  event.value
})
const handleLogin = () => {
  event.value = true
}

</script>

<template>
  <a-layout id="root-layout">
    <a-layout-header class="header">
      <div class="logo" />
    </a-layout-header>
    <a-layout>
      <Login v-if="!isAuthenticated" @change="handleLogin" />
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
