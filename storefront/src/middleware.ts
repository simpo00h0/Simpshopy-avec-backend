import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'preview', 's'];

function getSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');
  if (parts.length < 2) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) return null;
  return subdomain;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = getSubdomain(host);

  if (!subdomain) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/s/') || pathname.startsWith('/preview/') || pathname.startsWith('/_next')) {
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
