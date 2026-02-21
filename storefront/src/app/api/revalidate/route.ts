import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const H = { 'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (d: object, s = 200) => NextResponse.json(d, { status: s, headers: H });

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: H });
}

export async function POST(req: NextRequest) {
  const { store, secret } = Object.fromEntries(new URL(req.url).searchParams);
  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) return json({ error: 'Invalid secret' }, 401);
  if (!store || !/^[a-z0-9-]+$/i.test(store)) return json({ error: 'Invalid store' }, 400);
  try {
    revalidateTag(`store-${store}`);
    return json({ revalidated: true, store });
  } catch {
    return json({ error: 'Revalidation failed' }, 500);
  }
}
