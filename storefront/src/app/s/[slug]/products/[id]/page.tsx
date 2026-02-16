'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductTemplate } from '@/themes/templates/ProductTemplate';
import { useTheme } from '@/themes/ThemeContext';

export default function StoreProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { theme, basePath } = useTheme();

  const product = theme.products.find((p) => p.id === productId);

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
