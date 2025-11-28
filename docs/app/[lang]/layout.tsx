import '../global.css';
import 'remixicon/fonts/remixicon.css';
import { ClientRootProvider } from '@/components/providers/client-root-provider';
import { Inter } from 'next/font/google';
import { use } from 'react';
import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import type { Metadata } from 'next';
import { i18n } from '@/lib/i18n';

// Generate static params for static export
export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}

const inter = Inter({
  subsets: ['latin'],
});

// Chinese translations
const zh: Partial<Translations> = {
  search: '搜索'
};


// Available language configurations
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '中文',
    locale: 'zh',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  // Resolve Promise to get language parameter
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  // Set different titles and descriptions based on language
  const titles = {
    en: 'ADP Chat Client - An open sourced AI Agent application conversation interface.',
    zh: 'ADP Chat Client - 开源的 AI 智能体应用对话端。',
  };

  const descriptions = {
    en: 'ADP Chat Client is an open-source conversational interface for AI agent applications. Deploy Tencent Cloud ADP developed AI agents as web applications, or embed them into mini-programs, Android, and iOS apps.',
    zh: 'ADP Chat Client 是一个开源的 AI 智能体应用对话端。可以将腾讯云智能体开发平台（Tencent Cloud ADP）开发的 AI 智能体应用快速部署为 Web 应用，或嵌入到小程序、Android、iOS 应用中。',
  };

  const keywordsMap = {
    en: ['ADP Chat Client', 'Tencent Cloud ADP', 'AI Agent', 'Conversational AI', 'AI Deployment', 'Open Source'],
    zh: ['ADP Chat Client', '腾讯云 ADP', 'AI 智能体', '对话应用', 'AI 部署', '开源'],
  } as const;

  const locales = {
    en: 'en_US',
    zh: 'zh_CN',
  };

  const title = titles[lang as keyof typeof titles] || titles.en;
  const description = descriptions[lang as keyof typeof descriptions] || descriptions.en;
  const keywords = keywordsMap[lang as keyof typeof keywordsMap] || keywordsMap.en;
  const locale = locales[lang as keyof typeof locales] || locales.en;

  return {
    title,
    description,
    keywords,
    icons: {
      icon: '/images/favicon.png',
      apple: '/images/favicon.png',
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: '/images/hello-adp.png',
          width: 1200,
          height: 630,
          alt: 'ADP Chat Client Logo',
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/hello-adp.png'],
    },
  };
}

export default function Layout({ 
  children,
  params 
}: { 
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const { lang } = resolvedParams;
  
  // Select translations based on language
  const translations = {
    zh
  }[lang];

  return (
    <ClientRootProvider
      i18n={{
        locale: lang,
        locales,
        translations
      }}
    >
      {children}
    </ClientRootProvider>
  );
}
