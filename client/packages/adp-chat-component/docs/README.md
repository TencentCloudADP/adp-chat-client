# adp-chat-component 组件库文档

基于 [Fumadocs](https://fumadocs.vercel.app/) 构建的组件库文档站点。

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看文档。

## 构建

```bash
# 构建静态站点
npm run build
```

构建产物将输出到 `out` 目录。

## 目录结构

```
docs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── global.css         # 全局样式
│   └── docs/              # 文档路由
├── content/docs/          # 文档内容 (MDX)
│   ├── meta.json          # 导航配置
│   ├── index.mdx          # 介绍页
│   ├── quick-start.mdx    # 快速开始
│   └── components/        # 组件文档
├── components/            # React 组件
│   └── api-table.tsx      # API 表格组件
├── lib/                   # 工具库
│   └── source.ts          # 文档源配置
├── source.config.ts       # Fumadocs 配置
└── mdx-components.tsx     # MDX 组件映射
```

## 添加新组件文档

1. 在 `content/docs/components/` 对应目录下创建 `.mdx` 文件
2. 在对应目录的 `meta.json` 中添加页面引用
3. 使用 `<PropsTable>`, `<EventsTable>`, `<SlotsTable>`, `<MethodsTable>` 组件展示 API

示例：

```mdx
---
title: MyComponent
description: 组件描述
---

# MyComponent

组件说明...

## API

<PropsTable data={[
  { name: 'prop1', type: 'string', default: "''", description: '属性说明' },
]} />

<EventsTable data={[
  { name: 'click', params: 'MouseEvent', description: '点击事件' },
]} />
```
