import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';
import { getCachedStore } from '@/lib/store-cache';
import { fetchSubdomains } from '@/lib/store-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl(null);
  const subdomains = await fetchSubdomains();
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ];

  for (const slug of subdomains) {
    const store = await getCachedStore(slug);
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
