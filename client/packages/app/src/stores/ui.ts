import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type LanguageType } from '@/i18n'
import { isMobile as isMobileUA } from '@/utils/ua'

export const useUiStore = defineStore('ui', () => {
  const { locale } = useI18n()
  const theme = ref<'light' | 'dark' | null>('light')
  const language = ref<LanguageType>('zh')
  const drawerVisible = ref<boolean>(false)
  const isMobile = ref<boolean>(isMobileUA())

  const setTheme = (newTheme: 'light' | 'dark' | null) => {
    theme.value = newTheme
    document.documentElement.setAttribute('theme-mode', newTheme || 'light')
    localStorage.setItem('theme-mode', newTheme || 'light')
  }

  const setLanguage = (newLanguage: LanguageType | null) => {
    language.value = newLanguage || 'zh'
    locale.value = newLanguage || 'zh'
    localStorage.setItem('language', newLanguage || 'zh')
  }

  const setDrawerVisible = (visible: boolean) => {
    drawerVisible.value = visible
  }

  const toggleDrawer = () => {
    drawerVisible.value = !drawerVisible.value
  }

  return {
    isMobile,
    theme,
    language,
    drawerVisible,
    setTheme,
    setLanguage,
    setDrawerVisible,
    toggleDrawer,
  }
})

/**
 * 初始化主题模式（light/dark）。
 * 从 localStorage 读取 theme-mode 并设置到 html 根元素属性。
 */
const initTheme = () => {
  const theme = localStorage.getItem('theme-mode') as 'light' | 'dark' | null
  const uiStore = useUiStore()
  uiStore.setTheme(theme)
}

const initLanguage = () => {
  // 初始化语言设置
  const language = (localStorage.getItem('language') as LanguageType) || 'zh'
  const uiStore = useUiStore()
  uiStore.setLanguage(language)
}

/**
 * 侧边栏收起/展开逻辑，根据窗口宽度自动设置。
 */
const autoCollapsed = () => {
  const uiStore = useUiStore()
  uiStore.setDrawerVisible(!uiStore.isMobile)
}

/**
 * 初始化 UI 相关设置。
 * 包括主题初始化、侧边栏收起/展开逻辑等。
 */
export const initUI = () => {
  // Initialize theme
  initTheme()

  // Initialize language
  initLanguage()

  // Initialize sidebar collapsed logic
  autoCollapsed()
  window.onresize = () => {
    autoCollapsed()
  }
  // Add any other UI initialization logic here
}
