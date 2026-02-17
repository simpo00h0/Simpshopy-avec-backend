'use client';

import { Container, Title, Grid } from '@mantine/core';
import { useTheme } from '../ThemeContext';
import { ProductCard } from './ProductCard';
import type { MockProduct } from '../theme-types';

interface FeaturedProductsSectionProps {
  products?: MockProduct[];
  title?: string;
  limit?: number;
}

export function FeaturedProductsSection({ products: propProducts, title, limit }: FeaturedProductsSectionProps) {
  const { theme, basePath } = useTheme();
  const displayTitle = title ?? theme.featuredProductsTitle ?? 'Nos produits';
  const displayLimit = limit ?? theme.featuredProductsLimit ?? 6;
  const products = (propProducts ?? theme.products.slice(0, displayLimit)).filter((p): p is MockProduct => !!p.slug);

  return (
    <section
      style={{
        padding: '48px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="xl">
        <Title order={2} mb="xl" ta="center" style={{ color: theme.colors.text }}>
          {displayTitle}
        </Title>
        <Grid gutter="lg">
          {products.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
              <ProductCard product={product} basePath={basePath} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
