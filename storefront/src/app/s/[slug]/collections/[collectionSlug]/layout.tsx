import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCachedStore } from '@/lib/store-cache';
import { buildStorePageUrl } from '@/lib/seo';
import type { StoreCollection } from '@/lib/store-api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; collectionSlug: string }>;
}): Promise<Metadata> {
  const { slug, collectionSlug } = await params;
  const store = await getCachedStore(slug);
  if (!store) return { title: 'Boutique introuvable' };

  const collection = store.collections?.find(
    (c: StoreCollection) => c.slug === collectionSlug
  );
  const name = collection?.name || 'Collection';
  const title = `${name} | ${store.name}`;
  const description =
    store.description ||
    `Parcourez ${name} sur ${store.name}. Achat en ligne sécurisé.`;

  const headersList = await headers();
  const host = headersList.get('host');
  const url = buildStorePageUrl(host, slug, [
    'collections',
    collectionSlug,
  ]);

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

export default async function CollectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; collectionSlug: string }>;
}) {
  const { slug, collectionSlug } = await params;
  const store = await getCachedStore(slug);
  if (!store) notFound();

  const collection = store.collections?.find(
    (c: StoreCollection) => c.slug === collectionSlug
  );
  if (!collection) notFound();

  const headersList = await headers();
  const host = headersList.get('host');
  const url = buildStorePageUrl(host, slug, [
    'collections',
    collectionSlug,
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: store.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
