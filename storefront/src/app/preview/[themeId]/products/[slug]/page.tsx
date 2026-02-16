'use client';

import { useParams } from 'next/navigation';
import { ProductTemplate } from '@/themes/templates/ProductTemplate';
import { themesData } from '@/themes/data';

export default function PreviewProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const themeId = params.themeId as string;
  const theme = themesData[themeId];

  if (!theme) return null;

  const product = theme.products.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Produit introuvable</h2>
        <a href={`/preview/${themeId}/products`}>Retour aux produits</a>
      </div>
    );
  }

  return <ProductTemplate product={product} />;
}
