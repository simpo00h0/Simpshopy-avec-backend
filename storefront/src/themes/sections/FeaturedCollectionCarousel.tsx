'use client';

import { Container, Title, Box } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useTheme } from '../ThemeContext';
import { ProductCard } from './ProductCard';

interface FeaturedCollectionCarouselProps {
  title?: string;
  productIds?: string[];
}

export function FeaturedCollectionCarousel({ title = 'Nouveautés', productIds }: FeaturedCollectionCarouselProps) {
  const { theme, basePath } = useTheme();
  const products = productIds
    ? theme.products.filter((p) => productIds.includes(p.id))
    : theme.products.slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section
      style={{
        padding: '48px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="xl">
        <Title order={2} mb="xl" ta="center" style={{ color: theme.colors.text }}>
          {title}
        </Title>
        <Carousel
          slideSize="280px"
          slideGap="md"
          align="start"
          loop
          withIndicators
          styles={{
            control: {
              backgroundColor: theme.colors.primary,
              color: 'white',
            },
          }}
        >
          {products.map((product) => (
            <Carousel.Slide key={product.id}>
              <Box style={{ padding: 4 }}>
                <ProductCard product={product} basePath={basePath} />
              </Box>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
