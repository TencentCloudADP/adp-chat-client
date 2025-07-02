<script setup lang="ts">
import { ref, reactive, computed, watch, handleError } from 'vue'
import Chat from './components/ChatWithConversationList.vue'
import Login from './components/Login.vue'
import useEventsBus from '@/util/eventBus'
const { emit, bus } = useEventsBus()
import Cookies from 'js-cookie'

const access_token = ref(Cookies.get('token') as null|string)

const isAuthenticated = computed(() => {
  return !!(access_token.value)
})

watch(()=>bus.value.get('login-state-changed'), (_access_token) => {
  access_token.value = _access_token
})

const handleLogout = () => {
  Cookies.remove('token')
  emit("login-state-changed", null)
}

</script>

<template>
  <a-layout id="root-layout">
    <a-layout-header class="header">
      <div class="logo" />
      <a-button id="logout" @click="handleLogout" v-if="isAuthenticated">退出</a-button>
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
#logout {
  float: right;
  margin: 15px;
}
</style>
