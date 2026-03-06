'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StorefrontSkeleton } from '@/components/StorefrontSkeleton';
import { CollectionTemplate } from '@/themes/templates/CollectionTemplate';

function ProductsContent() {
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get('collection') ?? 'all';
  return <CollectionTemplate collectionSlug={collectionSlug} />;
}

export default function PreviewProductsPage() {
  return (
    <Suspense fallback={<StorefrontSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
