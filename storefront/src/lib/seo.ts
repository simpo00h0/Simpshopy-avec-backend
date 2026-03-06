import { getSubdomain } from './subdomain';

export function getBaseUrl(host?: string | null): string {
  if (host) {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    return `${protocol}://${host}`;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://simpshopy.com')
  );
}

export function buildStorePageUrl(
  host: string | null,
  slug: string,
  pathSegments: string[] = []
): string {
  const baseUrl = getBaseUrl(host);
  const subdomain = host ? getSubdomain(host) : null;
  const path = pathSegments.filter(Boolean).join('/');
  if (subdomain === slug) {
    return path ? `${baseUrl}/${path}` : baseUrl;
  }
  const prefix = `/s/${slug}`;
  return path ? `${baseUrl}${prefix}/${path}` : `${baseUrl}${prefix}`;
}
