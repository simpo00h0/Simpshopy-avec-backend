import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StoreLayoutClient } from './StoreLayoutClient';

async function getStore(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/storefront/${slug}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>}>
      <StoreLayoutClient store={store} slug={slug}>{children}</StoreLayoutClient>
    </Suspense>
  );
}
