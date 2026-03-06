import { unstable_cache } from 'next/cache';
import { fetchStore } from './store-api';

/**
 * Store mis en cache côté serveur.
 * Un seul appel API par boutique pendant la fenêtre de revalidation.
 * Les navigations client réutilisent le cache Next.js = 0 appel backend.
 */
export async function getCachedStore(subdomain: string) {
  return unstable_cache(
    () => fetchStore(subdomain),
    [`store-${subdomain}`],
    { tags: [`store-${subdomain}`], revalidate: 300 }
  )();
}
