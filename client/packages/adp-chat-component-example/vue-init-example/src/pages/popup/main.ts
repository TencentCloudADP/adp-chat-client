import { createApp } from 'vue'
import 'tdesign-vue-next/es/style/index.css'
import 'virtual:svg-icons-register'
import '../../assets/main.css'
import App from './App.vue'
import { configureAxios } from 'adp-chat-component'

const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : './'

configureAxios({
  baseURL,
  timeout: 1000 * 60,
})

const app = createApp(App)
app.mount('#app')
