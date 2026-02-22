import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSubdomain } from '@/lib/subdomain';

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

  const sMatch = pathname.match(/^\/s\/([^/]+)(\/.*)?$/);
  if (sMatch) {
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
