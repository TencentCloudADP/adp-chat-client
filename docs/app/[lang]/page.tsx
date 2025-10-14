import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
  const target = `${basePath}/docs/${lang}`;
  const normalized = target.startsWith('/') ? target : `/${target}`;
  redirect(normalized.replace(/\/{2,}/g, '/'));
}
