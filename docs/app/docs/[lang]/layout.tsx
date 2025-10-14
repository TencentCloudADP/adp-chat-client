import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import LocaleProvider from '@/components/LocaleProvider';

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
    <LocaleProvider locale={lang} locales={locales} translations={translations}>
      <DocsLayout
        {...baseOptions(lang)}
        tree={pageTree}
      >
        {children}
      </DocsLayout>
    </LocaleProvider>
  );
}
