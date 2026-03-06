/** Invalide le cache du storefront pour une boutique (prise en compte immédiate des changements). */
export function revalidateStorefrontCache(subdomain: string): void {
  const base = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';
  const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || '';
  const url = `${base}/api/revalidate?store=${encodeURIComponent(subdomain)}${secret ? `&secret=${encodeURIComponent(secret)}` : ''}`;
  fetch(url, { method: 'POST' }).catch(() => {});
}
