import './global.css';
import 'remixicon/fonts/remixicon.css';
import { ClientRootProvider } from '@/components/providers/client-root-provider';
import Script from 'next/script';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// 移除根布局的 metadata，让子布局（[lang]/layout.tsx）的多语言 metadata 生效
// 这样可以根据不同语言显示不同的标题和描述
export const metadata: Metadata = {
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-15PHNMPFD1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-15PHNMPFD1');
          `}
        </Script>
        <ClientRootProvider>{children}</ClientRootProvider>
      </body>
    </html>
  );
}
