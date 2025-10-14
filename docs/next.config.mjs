import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: false,
  output: 'export',
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
};

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

export default withMDX(config);
