import '@/assets/main.css'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'

import '@/assets/theme.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import i18n, { t } from '@/i18n'
import 'virtual:svg-icons-register' //  雪碧图

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.config.globalProperties.$t = t

// 使用国际化文案作为页面标题
const setDocumentTitle = () => {
  document.title = t('project.projectName')
}

// 初始设置标题
setDocumentTitle()

// 监听语言切换，动态更新标题
watch(
  () => i18n.global.locale.value,
  () => {
    setDocumentTitle()
  },
)

app.mount('#app')
