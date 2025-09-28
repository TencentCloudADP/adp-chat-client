import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const languageMap = {
  en: 'English',
  zh: '中文',
}

export type LanguageType = 'en' | 'zh'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})

export default i18n

export const t = i18n.global.t

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: typeof i18n.global.t
  }
}
