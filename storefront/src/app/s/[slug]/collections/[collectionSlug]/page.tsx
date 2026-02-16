'use client';

import { useParams } from 'next/navigation';
import { CollectionTemplate } from '@/themes/templates/CollectionTemplate';

export default function StoreCollectionPage() {
  const params = useParams();
  const collectionSlug = params.collectionSlug as string;
  return <CollectionTemplate collectionSlug={collectionSlug} />;
}
