import { Suspense } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import type { Metadata } from 'next';
import { StoreLayoutClient } from './StoreLayoutClient';
import { StorefrontSkeleton } from '@/components/StorefrontSkeleton';
import { fetchStore } from '@/lib/store-api';
import { getSubdomain } from '@/lib/subdomain';
import { buildStorePageUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

async function getStore(subdomain: string) {
  const cached = unstable_cache(
    () => fetchStore(subdomain),
    [`store-${subdomain}`],
    { tags: [`store-${subdomain}`], revalidate: 60 }
  );
  return cached();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) return { title: 'Boutique introuvable' };

  const headersList = await headers();
  const host = headersList.get('host');
  const url = buildStorePageUrl(host, slug);
  const title = `${store.name} - Boutique en ligne`;
  const description =
    store.description ||
    `Découvrez les produits de ${store.name}. Achat en ligne sécurisé.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: store.name,
      type: 'website',
      locale: 'fr_FR',
      images: store.logo ? [{ url: store.logo, alt: store.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: store.logo ? [store.logo] : undefined,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
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

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const subdomain = getSubdomain(host);
  const basePath = subdomain ? '' : `/s/${slug}`;
  const url = buildStorePageUrl(host, slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: store.name,
    url,
    description: store.description || undefined,
    logo: store.logo || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `if(new URLSearchParams(window.location.search).get("editor")==="1"){window.parent?.postMessage({type:"simpshopy-editor-ready"},"*");}`,
        }}
      />
      <Suspense fallback={<StorefrontSkeleton />}>
        <StoreLayoutClient store={store} subdomain={slug} basePath={basePath}>
          {children}
        </StoreLayoutClient>
      </Suspense>
    </>
  );
}
