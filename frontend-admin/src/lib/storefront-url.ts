/**
 * Retourne l'URL de la boutique au format sous-domaine.
 * Ex: mastore.localhost:3002 (dev) ou mastore.simpshopy.com (prod)
 */
export function getStoreUrl(slug: string): string {
  const storefrontDomain = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || 'localhost:3002';
  const isLocalhost = storefrontDomain.includes('localhost');

  if (isLocalhost) {
    return `http://${slug}.${storefrontDomain}`;
  }
  return `https://${slug}.${storefrontDomain}`;
}
