# Vercel 部署指南

本文档说明如何将 Hello ADP 文档网站部署到 Vercel。

## 快速部署

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 在 docs 目录下运行：
```bash
cd docs
vercel
```

3. 按照提示完成配置。

### 方法二：通过 Vercel 网站

1. 访问 [Vercel](https://vercel.com)
2. 连接你的 Git 仓库
3. 选择 `docs` 文件夹作为根目录
4. Vercel 会自动检测到这是一个 Next.js 项目

## 配置说明

### 必要文件

- `vercel.json` - Vercel 部署配置
- `.vercelignore` - 忽略文件配置
- `.env.example` - 环境变量示例

### 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```bash
# 必需
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Hello ADP Docs

# 可选 - Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 可选 - Giscus 评论系统
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### 自定义域名

1. 在 Vercel 项目设置中添加自定义域名
2. 更新 `NEXT_PUBLIC_SITE_URL` 环境变量
3. 确保 DNS 设置正确

## 构建配置

项目使用以下构建设置：

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## 性能优化

- 启用了 Vercel 的边缘缓存
- 配置了适当的 HTTP 头部
- 优化了图片加载
- 支持多语言路由

## 故障排除

### 常见问题

1. **构建失败**：检查 Node.js 版本是否兼容
2. **样式问题**：确保 Tailwind CSS 配置正确
3. **路由问题**：检查 `next.config.mjs` 中的路由配置

### 调试步骤

1. 查看 Vercel 构建日志
2. 检查环境变量设置
3. 本地测试构建：`npm run build`
4. 检查 `vercel.json` 配置

## 监控和分析

- Vercel Analytics 自动启用
- 可以添加 Google Analytics
- 支持 Giscus 评论系统

## 更新部署

每次推送到主分支时，Vercel 会自动重新部署。你也可以：

1. 手动触发部署
2. 使用 Vercel CLI：`vercel --prod`
3. 通过 Vercel 网站界面

## 支持

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Fumadocs 文档](https://fumadocs.vercel.app)