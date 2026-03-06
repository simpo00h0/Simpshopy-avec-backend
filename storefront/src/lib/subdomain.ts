const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'preview', 's'];

/** Domaines où le sous-domaine n'est PAS une boutique (path /s/[slug] uniquement) */
const PATH_ONLY_DOMAINS = ['vercel.app', 'localhost'];

export function getSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');
  if (parts.length < 2) return null;
  // Sur Vercel ou localhost, pas de routage par sous-domaine → utiliser /s/[slug]
  if (PATH_ONLY_DOMAINS.some((d) => hostname.endsWith(d))) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) return null;
  return subdomain;
}
