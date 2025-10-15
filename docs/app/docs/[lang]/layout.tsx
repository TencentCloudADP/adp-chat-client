import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { baseOptions } from '@/app/layout.config';
import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { generateI18nUrl } from '@/lib/i18n-utils';

// 为静态导出生成静态参数
export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}

const zh: Partial<Translations> = {
  search: '搜索'
};

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



export default async function Layout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const pageTree = source.pageTree[lang] || source.pageTree.en;

  const translations = {
    zh,
  }[lang];

  return (
    <RootProvider
      i18n={{
        locale: lang,
        locales: locales.map(locale => ({
          ...locale,
          // 为每个语言选项添加正确的 URL 生成逻辑
          url: generateI18nUrl(locale.locale, `/docs/${lang}/`)
        })),
        translations,
      }}
    >
      <DocsLayout
        {...baseOptions(lang)}
        tree={pageTree}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
