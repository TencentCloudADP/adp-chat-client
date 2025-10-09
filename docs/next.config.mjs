import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',  // 启用静态导出用于 GitHub Pages
  trailingSlash: true,  // GitHub Pages 需要尾部斜杠
  images: {
    unoptimized: true,  // 静态导出需要禁用图片优化
  },
};

export default withMDX(config);
