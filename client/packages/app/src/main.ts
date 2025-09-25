import '@/assets/main.css'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'

import '@/assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
// import "@/utils/mathjax";
// import "mathjax/es5/tex-svg"; 
import i18n, { t } from '@/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.config.globalProperties.$t = t

app.mount('#app')
