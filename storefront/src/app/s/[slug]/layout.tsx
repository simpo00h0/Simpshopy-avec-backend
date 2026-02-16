import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StoreLayoutClient } from './StoreLayoutClient';
import { API_BASE_URL } from '@/lib/constants';

async function getStore(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/storefront/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storefront] Erreur chargement boutique:', err);
    }
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
