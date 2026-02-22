'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/themes/ThemeContext';

/** Redirection /products → /collections/all (style Shopify) */
export default function StoreProductsRedirect() {
  const router = useRouter();
  const { basePath } = useTheme();

  useEffect(() => {
    router.replace(basePath ? `${basePath}/collections/all` : '/collections/all');
  }, [router, basePath]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      Redirection...
    </div>
  );
}
