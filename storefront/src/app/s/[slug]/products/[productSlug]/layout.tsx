import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCachedStore } from '@/lib/store-cache';
import { buildStorePageUrl } from '@/lib/seo';
import type { StoreProduct } from '@/lib/store-api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const store = await getCachedStore(slug);
  if (!store) return { title: 'Boutique introuvable' };

  const product = store.products.find(
    (p: StoreProduct) => p.slug === productSlug
  );
  if (!product) return { title: 'Produit introuvable' };

  const headersList = await headers();
  const host = headersList.get('host');
  const url = buildStorePageUrl(host, slug, ['products', productSlug]);
  const title = `${product.name} | ${store.name}`;
  const description =
    product.description ||
    `${product.name} - ${product.price.toLocaleString('fr-FR')} XOF. Achetez en ligne sur ${store.name}.`;
  const image = product.images?.[0];

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
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const store = await getCachedStore(slug);
  if (!store) notFound();

  const product = store.products.find(
    (p: StoreProduct) => p.slug === productSlug
  );
  if (!product) notFound();

  const headersList = await headers();
  const host = headersList.get('host');
  const url = buildStorePageUrl(host, slug, ['products', productSlug]);
  const image = product.images?.[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: image || undefined,
    url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'XOF',
      availability: 'https://schema.org/InStock',
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
