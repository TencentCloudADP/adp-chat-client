<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import useEventsBus from '@/util/eventBus'
import { store } from '@/util/store.js'
const { emit, bus } = useEventsBus()
import Cookies from 'js-cookie'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const accessToken = ref(Cookies.get('token') as null|string)

const checkLogin = async () => {
  await router.isReady()
  if (accessToken.value) {
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

watch(()=>bus.value.get('login-state-changed'), (_accessToken) => {
  if (_accessToken == null) {
    let path = window.location.pathname.split('/static/app/index')[0]
    if (path == '') {
      path = '/'
    }
    Cookies.remove('token', { path: path})
  }
  accessToken.value = _accessToken
  checkLogin()
})

onMounted(async () => {
  await checkLogin()
})

</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        fontSize: store.isMobile ? 17 : 14,
      },
    }"
  />
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
