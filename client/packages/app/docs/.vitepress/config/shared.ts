import { defineConfig } from 'vitepress'

export const shared = defineConfig({
  cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/asserts/img/logo.svg' }]],
  themeConfig: {
    i18nRouting: true, // 启用自动语言重定向
    logo: '/asserts/img/logo.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
