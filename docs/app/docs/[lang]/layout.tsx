import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { baseOptions } from '@/app/layout.config';
import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';

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

// 修复语言切换的 URL 生成逻辑
function generateI18nUrl(targetLocale: string, currentPathname: string): string {
  // 确保路径始终保持 /docs/ 前缀
  if (currentPathname.startsWith('/docs/')) {
    // 替换路径中的语言部分
    const pathWithoutLang = currentPathname.replace(/^\/docs\/[^\/]+/, '');
    return `/docs/${targetLocale}${pathWithoutLang}`;
  }
  // 对于其他路径，默认跳转到文档首页
  return `/docs/${targetLocale}/`;
}

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
          url: typeof window !== 'undefined' 
            ? generateI18nUrl(locale.locale, window.location.pathname)
            : `/docs/${locale.locale}/`
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
