import type { DefaultTheme } from 'vitepress'

export default {
  lang: 'en-US',
  title: 'ADP Chat Client',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en' },
      { text: 'Front End Development', link: '/en/front/quick-start' },
      { text: 'Server Development', link: '/en/server/quick-start' },
    ],
    sidebar: {
      // 当用户位于 `front` 目录时，会显示此侧边栏
      '/en/front/': [
        {
          text: 'Front End Development',
          items: [
            { text: 'Quick Start', link: '/en/front/quick-start' },
            { text: 'I18n', link: '/en/front/i18n' },
          ],
        },
      ],

      // 当用户位于 `server` 目录时，会显示此侧边栏
      '/en/server/': [
        {
          text: 'Server Development',
          items: [
            { text: 'Quick Start', link: '/en/server/quick-start' },
            { text: 'API Examples', link: '/en/server/api-examples' },
          ],
        },
      ],
    },
    docFooter: { prev: 'Previous', next: 'Next' }, // 本地化文本
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2025-present Tencent Cloud`,
    },
  } as DefaultTheme.Config,
}
