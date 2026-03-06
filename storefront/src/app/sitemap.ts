import type { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { getBaseUrl } from '@/lib/seo';

interface StoreData {
  subdomain: string;
  products?: { slug: string }[];
  collections?: { slug: string }[];
}

async function fetchStore(subdomain: string): Promise<StoreData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/storefront/${subdomain}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchSubdomains(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/storefront`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.subdomains ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl(null);
  const subdomains = await fetchSubdomains();
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ];

  for (const slug of subdomains) {
    const store = await fetchStore(slug);
    if (!store) continue;

    const storeUrl = `${baseUrl}/s/${slug}`;
    entries.push({
      url: storeUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    for (const product of store.products ?? []) {
      entries.push({
        url: `${storeUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const collection of store.collections ?? []) {
      entries.push({
        url: `${storeUrl}/collections/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
