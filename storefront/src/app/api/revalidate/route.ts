import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get('store');
  const secret = searchParams.get('secret');

  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (!store || !/^[a-z0-9-]+$/i.test(store)) {
    return NextResponse.json({ error: 'Invalid store' }, { status: 400 });
  }

  try {
    revalidateTag(`store-${store}`);
    return NextResponse.json({ revalidated: true, store });
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
