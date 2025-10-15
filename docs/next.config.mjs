import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// GitHub Pages 配置
const isGithubPages = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = isGithubPages ? process.env.NEXT_PUBLIC_BASE_PATH : '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: false,
  // GitHub Pages 配置
  basePath: basePath,
  assetPrefix: basePath,
  output: 'export',
  trailingSlash: true,
  // 禁用图片优化（GitHub Pages 不支持）
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 静态导出时跳过某些功能
  ...(isGithubPages && {
    // 禁用服务端功能
    experimental: {
      // 其他实验性功能配置
    }
  })
};

// 只在非静态导出模式下设置 headers
if (!isGithubPages) {
  config.headers = async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' *.hellodify.com; frame-src 'self' *.hellodify.com http://*.hellodify.com https://*.hellodify.com https://giscus.app https://www.youtube.com https://*.youtube.com https://*.vercel.app https://vercel.com; child-src 'self' *.hellodify.com http://*.hellodify.com https://*.hellodify.com https://giscus.app https://www.youtube.com https://*.youtube.com https://*.vercel.app https://vercel.com; img-src 'self' data: *.hellodify.com http://*.hellodify.com https://*.hellodify.com s2.loli.net https://avatars.githubusercontent.com https://twimg.com https://pbs.twimg.com https://*.github.io https://*.youtube.com https://*.ytimg.com https://*.vercel.app https://vercel.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://giscus.app https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://api.github.com https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com;"
        }
      ]
    }
  ];
}

export default withMDX(config);
