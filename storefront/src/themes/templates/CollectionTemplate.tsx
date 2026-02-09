'use client';

import { useRouter } from 'next/navigation';
import { Container, Title, Grid, Select } from '@mantine/core';
import { useTheme } from '../ThemeContext';
import { ProductCard } from '../sections/ProductCard';

interface CollectionTemplateProps {
  collectionId?: string;
}

export function CollectionTemplate({ collectionId }: CollectionTemplateProps) {
  const router = useRouter();
  const { theme, basePath } = useTheme();
  const collections = theme.collections ?? [{ id: 'all', name: 'Tous les produits', productIds: theme.products.map((p) => p.id) }];
  const currentCollection = collectionId
    ? collections.find((c) => c.id === collectionId) ?? collections[0]
    : collections[0];

  const products = currentCollection
    ? theme.products.filter((p) => currentCollection.productIds.includes(p.id))
    : theme.products;

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl" style={{ color: theme.colors.text }}>
        {currentCollection?.name ?? 'Produits'}
      </Title>
      {collections.length > 1 && (
        <Select
          label="Collection"
          placeholder="Choisir"
          data={collections.map((c) => ({ value: c.id, label: c.name }))}
          value={currentCollection?.id}
          onChange={(v) => {
            if (v) router.push(`${basePath}/products?collection=${v}`);
          }}
          mb="xl"
          style={{ maxWidth: 300 }}
        />
      )}
      <Grid gutter="lg">
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
            <ProductCard product={product} basePath={basePath} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
