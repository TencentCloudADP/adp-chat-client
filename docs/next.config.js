/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出模式，生成纯静态文件
  output: 'export',
  
  // 设置基础路径，因为部署到 /adp-chat-client/ 子路径
  basePath: '/adp-chat-client',
  
  // 设置资源前缀，确保 CSS/JS/图片路径正确
  assetPrefix: '/adp-chat-client',
  
  // 启用尾部斜杠，避免路由问题
  trailingSlash: true,
  
  // 禁用图片优化，因为静态导出不支持
  images: {
    unoptimized: true
  },
  
  // 禁用 ESLint 检查，加快构建速度
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig