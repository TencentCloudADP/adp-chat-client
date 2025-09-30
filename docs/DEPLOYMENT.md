# GitHub Pages 部署指南

本文档说明如何将 ADP Chat Client 文档站点自动部署到 GitHub Pages。

## 🚀 自动部署流程

### 触发条件
- 推送代码到 `main` 分支
- 且 `docs/` 目录下有文件变更

### 部署流程
1. **检测变更** - GitHub Actions 检测到 `docs/` 目录变更
2. **环境准备** - 安装 Node.js 18 和项目依赖
3. **构建项目** - 运行 `npm run build` 生成静态文件
4. **部署上线** - 将构建产物部署到 GitHub Pages

### 部署地址
- **生产地址**: https://tencentcloudadp.github.io/adp-chat-client/
- **构建状态**: 可在 GitHub Actions 页面查看

## 📁 相关文件说明

### `next.config.js`
Next.js 配置文件，包含：
- `output: 'export'` - 启用静态导出
- `basePath: '/adp-chat-client'` - 设置子路径
- `assetPrefix: '/adp-chat-client'` - 资源路径前缀
- `images.unoptimized: true` - 禁用图片优化

### `.github/workflows/deploy-docs.yml`
GitHub Actions 工作流，负责：
- 监听 `docs/` 目录变更
- 自动构建和部署
- 环境变量注入

### `package.json`
新增脚本命令：
- `npm run export` - 导出静态文件
- `npm run deploy` - 本地构建+导出（测试用）

## 🔧 本地开发

### 开发模式
```bash
cd docs
npm run dev
```

### 本地构建测试
```bash
cd docs
npm run build    # 构建项目
npm run export   # 导出静态文件
# 或者一键执行
npm run deploy
```

### 预览构建结果
```bash
cd docs/out
python -m http.server 8000
# 访问 http://localhost:8000
```

## 🌍 环境变量

### Google Analytics
- **环境变量**: `NEXT_PUBLIC_GA_ID`
- **默认值**: `G-15PHNMPFD1`
- **配置位置**: GitHub Secrets 或 `.env.local`

### 其他配置
- 所有 `NEXT_PUBLIC_*` 变量都会在构建时注入
- 可在 GitHub 仓库设置中配置 Secrets

## 🐛 故障排除

### 常见问题

1. **资源文件 404**
   - 检查 `next.config.js` 中的 `basePath` 和 `assetPrefix` 配置
   - 确保路径为 `/adp-chat-client`

2. **构建失败**
   - 查看 GitHub Actions 日志
   - 检查 `package.json` 中的依赖版本
   - 确保所有页面都能静态化

3. **路由不工作**
   - 检查 `trailingSlash: true` 配置
   - 确保动态路由有正确的 `generateStaticParams`

4. **Google Analytics 不工作**
   - 检查环境变量 `NEXT_PUBLIC_GA_ID` 是否正确设置
   - 在浏览器开发者工具中查看网络请求

### 调试步骤

1. **本地验证**
   ```bash
   cd docs
   npm run deploy
   cd out
   python -m http.server 8000
   ```

2. **检查构建日志**
   - 访问 GitHub Actions 页面
   - 查看具体的错误信息

3. **验证部署结果**
   - 访问 https://tencentcloudadp.github.io/adp-chat-client/
   - 检查页面是否正常加载
   - 验证 Google Analytics 是否工作

## 📝 更新流程

1. **修改文档内容** - 编辑 `docs/` 目录下的文件
2. **本地测试** - 运行 `npm run dev` 验证修改
3. **提交代码** - 推送到 `main` 分支
4. **自动部署** - GitHub Actions 自动构建和部署
5. **验证结果** - 访问线上地址确认更新

## 🔗 相关链接

- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Fumadocs 文档](https://fumadocs.dev/)