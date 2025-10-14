import './global.css';
import 'remixicon/fonts/remixicon.css';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  title: 'Hello ADP - 学习和分享腾讯云智能体平台最佳实践',
  description: '帮助新手快速上手腾讯云智能体平台（Tencent Cloud Agent Development Platform，ADP）的教程',
  icons: {
    icon: asset('/images/favicon.png'),
    apple: asset('/images/favicon.png'),
  },
  openGraph: {
    title: 'Hello ADP - 学习和分享腾讯云智能体平台最佳实践',
    description: '帮助新手快速上手腾讯云智能体平台（Tencent Cloud Agent Development Platform，ADP）的教程',
    images: [
      {
        url: asset('/images/hello-adp.png'),
        width: 1200,
        height: 630,
        alt: 'Hello ADP Logo',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hello ADP - 学习和分享腾讯云智能体平台最佳实践',
    description: '帮助新手快速上手腾讯云智能体平台（Tencent Cloud Agent Development Platform，ADP）的教程',
    images: [asset('/images/hello-adp.png')],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <GoogleAnalytics />
        <RootProvider search={{ enabled: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
