'use client';

import { Container, Title, SimpleGrid, Card, Text } from '@mantine/core';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';

export function CategoriesSection() {
  const { theme, basePath } = useTheme();
  const collections = theme.collections ?? [{ id: 'all', name: 'Tous les produits', productIds: [] }];
  const limit = theme.categoriesLimit;
  const displayCollections = limit != null ? collections.slice(0, limit) : collections;
  const title = theme.categoriesTitle ?? 'Parcourir par catégorie';

  if (displayCollections.length <= 1) return null;

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
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
          {displayCollections.map((col) => (
            <Card
              key={col.id}
              component={Link}
              href={`${basePath}/products?collection=${col.id}`}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: `linear-gradient(145deg, ${theme.colors.primary}10, ${theme.colors.accent}15)`,
                borderColor: theme.colors.secondary + '30',
                transition: 'transform 0.2s',
              }}
            >
              <Text fw={600} style={{ color: theme.colors.text }}>
                {col.name}
              </Text>
              <Text size="xs" c="dimmed">
                {col.productIds.length} produits
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
