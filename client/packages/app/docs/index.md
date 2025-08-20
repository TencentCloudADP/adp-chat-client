---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'ADP Chat Client'
  text: '一个开源的AI智能体应用对话端'
  tagline: 将您的智能体快速部署为Web应用
  image:
    src: /asserts/img/vitepress-logo-large.webp
    alt: VitePress
  actions:
    - theme: brand
      text: Web页面开发
      link: /front/quick-start
    - theme: alt
      text: 服务端开发
      link: /server/quick-start

features:
  - icon: ⚡
    title: 高性能后端架构
    details: 基于Python异步框架Sonic，更高的并发处理能力，资源消耗更低。
  - icon: 🎨
    title: 全功能现代化前端
    details: 基于Vue3组件化开发，扩展性强。支持Markdown/Latex渲染、语音输入、流式输出等功能。
  - icon: 🔐
    title: 灵活的账户体系
    details: 可快速对接外部身份认证系统。
  - icon: 🐳
    title: 高效容器化部署
    details: 实现环境隔离、一键部署，1核1G配置即可体验。
---
