import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHashHistory, createRouter } from 'vue-router'
import Login from './components/Login.vue'
import ChatView from './views/ChatView.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/chat/:conversationId?', name: 'chat', component: ChatView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
