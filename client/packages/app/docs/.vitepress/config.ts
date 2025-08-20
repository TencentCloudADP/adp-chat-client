import { defineConfig } from 'vitepress'
import { shared } from './config/shared'
import enConfig from './config/en'
import zhConfig from './config/zh'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ...shared,
  locales: {
    root: {
      label: '简体中文',
      link: '',
      ...zhConfig,
    },
    en: {
      label: 'English',
      ...enConfig,
    },
  },
})
