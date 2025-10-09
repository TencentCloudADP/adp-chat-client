import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',  // 启用静态导出用于 GitHub Pages
  trailingSlash: true,  // GitHub Pages 需要尾部斜杠
  // 只在生产构建时使用 basePath，避免本地开发问题
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/adp-chat-client',  // GitHub Pages 子路径
    assetPrefix: '/adp-chat-client/',  // 静态资源前缀
  }),
  images: {
    unoptimized: true,  // 静态导出需要禁用图片优化
  },
};

export default withMDX(config);
