'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductTemplate } from '@/themes/templates/ProductTemplate';
import { useTheme } from '@/themes/ThemeContext';

export default function StoreProductPage() {
  const params = useParams();
  const productSlug = params.productSlug as string;
  const { theme, basePath } = useTheme();

  const product = theme.products.find((p) => p.slug === productSlug || p.id === productSlug);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Produit introuvable</h2>
        <Link href={`${basePath}/products`}>Retour aux produits</Link>
      </div>
    );
  }

  return <ProductTemplate product={product} />;
}
