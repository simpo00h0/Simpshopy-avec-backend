import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { StoreLayoutClient } from './StoreLayoutClient';
import { API_BASE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

async function fetchStore(subdomain: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/storefront/${subdomain}`, {
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

async function getStore(subdomain: string) {
  const cached = unstable_cache(
    () => fetchStore(subdomain),
    [`store-${subdomain}`],
    { tags: [`store-${subdomain}`], revalidate: 60 }
  );
  return cached();
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
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `if(new URLSearchParams(window.location.search).get("editor")==="1"){window.parent?.postMessage({type:"simpshopy-editor-ready"},"*");}`,
        }}
      />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>}>
        <StoreLayoutClient store={store} subdomain={slug}>{children}</StoreLayoutClient>
      </Suspense>
    </>
  );
}
