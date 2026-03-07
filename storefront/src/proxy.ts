import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSubdomain } from '@/lib/subdomain';

const PATH_ONLY_DOMAINS = ['vercel.app', 'localhost'];

function isPathOnlyHost(host: string): boolean {
  const hostname = host.split(':')[0];
  return PATH_ONLY_DOMAINS.some((d) => hostname.endsWith(d));
}

function getBaseDomain(): string {
  return process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || 'localhost:3002';
}

function buildSubdomainUrl(slug: string, pathname: string): string {
  const base = getBaseDomain();
  const isLocalhost = base.includes('localhost');
  const protocol = isLocalhost ? 'http' : 'https';
  const path = pathname === '/' ? '' : pathname;
  return `${protocol}://${slug}.${base}${path}`;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Sur Vercel/localhost : rester sur /s/[slug], pas de redirection vers sous-domaine
  const sMatch = pathname.match(/^\/s\/([^/]+)(\/.*)?$/);
  if (sMatch && !isPathOnlyHost(host) && !isPathOnlyHost(getBaseDomain())) {
    const slug = sMatch[1];
    const rest = sMatch[2] || '';
    const search = request.nextUrl.search;
    const redirectUrl = buildSubdomainUrl(slug, rest || '/') + search;
    return NextResponse.redirect(redirectUrl);
  }

  const subdomain = getSubdomain(host);
  if (!subdomain) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/preview/') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const newPath = `/s/${subdomain}${pathname === '/' ? '' : pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
