<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import useEventsBus from '@/util/eventBus'
const { emit, bus } = useEventsBus()
import Cookies from 'js-cookie'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const access_token = ref(Cookies.get('token') as null|string)

const checkLogin = async () => {
  await router.isReady()
  if (access_token.value) {
    if (route.path == '/' || route.path == '/login') {
      router.replace('/chat')
    }
  } else {
    if (route.path.startsWith('/share/')) {
      return
    }
    router.replace('/login')
  }
}

watch(()=>bus.value.get('login-state-changed'), (_access_token) => {
  access_token.value = _access_token
  checkLogin()
})

onMounted(async () => {
  await checkLogin()
})

</script>

<template>
  <a-layout id="root-layout">
    <RouterView />
  </a-layout>
</template>

<style scoped>
.site-layout-background {
  background: #fff;
}
#root-layout {
  height: 100%;
  overflow: hidden;
}
</style>
