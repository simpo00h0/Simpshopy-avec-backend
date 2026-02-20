import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get('store');
  const secret = searchParams.get('secret');

  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401, headers: corsHeaders });
  }

  if (!store || !/^[a-z0-9-]+$/i.test(store)) {
    return NextResponse.json({ error: 'Invalid store' }, { status: 400, headers: corsHeaders });
  }

  try {
    revalidateTag(`store-${store}`);
    return NextResponse.json({ revalidated: true, store }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500, headers: corsHeaders });
  }
}
