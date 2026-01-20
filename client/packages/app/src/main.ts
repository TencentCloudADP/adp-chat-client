import '@/assets/main.css'
// 引入 adp-chat-component 组件库样式（生产构建后的完整样式）
import 'adp-chat-component/dist/es/adp-chat-component.css'

import '@/assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n'
import { setResponseInterceptor } from 'adp-chat-component'
import { logout } from '@/service/login'

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

app.mount('#app')
