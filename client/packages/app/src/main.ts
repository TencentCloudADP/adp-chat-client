import '@/assets/main.css'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'

import '@/assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'

import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n'
import { configureAxios, setResponseInterceptor } from 'adp-chat-component'
import { logout } from '@/service/login'

// 配置 adp-chat-component 的 axios 实例
const isDev = import.meta.env.DEV
let baseURL: string
if (isDev) {
  baseURL = '/api'
} else {
  const currentPath = window.location.pathname
  const staticIndex = currentPath.indexOf('/static')
  if (staticIndex !== -1) {
    const pathAfterStatic = currentPath.substring(staticIndex + '/static'.length)
    const pathSegments = pathAfterStatic.split('/').filter((segment) => segment.length > 0)
    const levelsToGoUp = pathSegments.length
    baseURL = '../'.repeat(levelsToGoUp)
  } else {
    baseURL = './'
  }
}

configureAxios({
  baseURL,
  timeout: 1000 * 60,
})

// 设置响应拦截器处理登录过期
setResponseInterceptor(
  (response) => response.data,
  async (error) => {
    const responseData = error.response?.data as { Error?: { Exception?: string } } | undefined
    if (responseData?.Error?.Exception === 'AccountUnauthorized') {
      logout(() => router.replace({ name: 'login' }))
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(TDesign)

app.mount('#app')
