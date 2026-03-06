import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { StoreLayoutShell } from './StoreLayoutShell';
import { getCachedStore } from '@/lib/store-cache';
import { buildStorePageUrl } from '@/lib/seo';
import { getSubdomain } from '@/lib/subdomain';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getCachedStore(slug);
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
  const store = await getCachedStore(slug);

  const headersList = await headers();
  const host = headersList.get('host') || headersList.get('x-forwarded-host') || '';
  const subdomain = getSubdomain(host);
  const basePath = subdomain === slug ? '' : `/s/${slug}`;
  const url = buildStorePageUrl(host, slug);
  const jsonLd = store
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: store.name,
        url,
        description: store.description || undefined,
        logo: store.logo || undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(new URLSearchParams(window.location.search).get("editor")==="1"){window.parent?.postMessage({type:"simpshopy-editor-ready"},"*");}`,
        }}
      />
      <StoreLayoutShell initialStore={store ?? undefined} initialBasePath={basePath}>
        {children}
      </StoreLayoutShell>
    </>
  );
}
