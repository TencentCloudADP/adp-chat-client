import type { DefaultTheme } from 'vitepress'

export default {
  lang: 'zh-CN',
  title: '智能体应用对话端',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '前端开发', link: '/front/quick-start' },
      { text: '后端开发', link: '/server/quick-start' },
    ],
    sidebar: {
      // 当用户位于 `front` 目录时，会显示此侧边栏
      '/front/': [
        {
          text: '前端开发',
          items: [
            { text: '快速开始', link: '/front/quick-start' },
            { text: '国际化', link: '/front/i18n' },
          ],
        },
      ],

      // 当用户位于 `server` 目录时，会显示此侧边栏
      '/server/': [
        {
          text: '后端开发',
          items: [
            { text: '快速开始', link: '/server/quick-start' },
            { text: 'API 示例', link: '/server/api-examples' },
          ],
        },
      ],
    },
    docFooter: { prev: '前一项', next: '下一项' }, // 本地化文本
    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2025-${new Date().getFullYear()} 腾讯云`,
    },
  } as DefaultTheme.Config,
}
