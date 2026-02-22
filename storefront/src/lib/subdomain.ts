const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'preview', 's'];

export function getSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');
  if (parts.length < 2) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) return null;
  return subdomain;
}
