'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';

const normalizedBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(
  /\/+$/,
  '',
);

function stripBase(pathname: string) {
  if (normalizedBasePath && pathname.startsWith(normalizedBasePath)) {
    const sliced = pathname.slice(normalizedBasePath.length);
    return sliced.startsWith('/') ? sliced : `/${sliced}`;
  }

  return pathname;
}

interface LocaleProviderProps {
  locale: string;
  locales: { name: string; locale: string }[];
  translations?: Partial<Translations>;
  children: ReactNode;
}

export default function LocaleProvider({
  locale,
  locales,
  translations,
  children,
}: LocaleProviderProps) {
  const router = useRouter();

  const handleLocaleChange = useCallback(
    (nextLocale: string) => {
      const { pathname, search, hash } = window.location;
      const relative = stripBase(pathname);
      const segments = relative.split('/').filter(Boolean);

      if (segments[0] === 'docs') {
        if (segments.length > 1) {
          segments[1] = nextLocale;
        } else {
          segments.push(nextLocale);
        }
      } else {
        segments.splice(0, segments.length, 'docs', nextLocale);
      }

      const nextPath = `/${segments.join('/')}`;
      router.push(`${nextPath}${search}${hash}`);
    },
    [router],
  );

  return (
    <RootProvider
      i18n={{
        locale,
        locales,
        translations,
        onLocaleChange: handleLocaleChange,
      }}
      search={{ enabled: false }}
    >
      {children}
    </RootProvider>
  );
}
