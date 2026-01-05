import { createApp } from 'vue'
import 'tdesign-vue-next/es/style/index.css'
import 'virtual:svg-icons-register'
import './assets/main.css'
import App from './App.vue'
import { configureAxios } from 'adp-chat-component'

// 配置 axios
const isDev = import.meta.env.DEV
let baseURL: string
if (isDev) {
  baseURL = '/api'
} else {
  baseURL = './'
}

configureAxios({
  baseURL,
  timeout: 1000 * 60,
})

const app = createApp(App)
app.mount('#app')
