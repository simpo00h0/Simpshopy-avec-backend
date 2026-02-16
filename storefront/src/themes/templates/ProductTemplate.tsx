'use client';

import { Container, Title, Text, Button, Grid, Box, Breadcrumbs, NumberInput, Divider } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { ProductCard } from '../sections/ProductCard';
import type { MockProduct } from '../theme-types';

interface ProductTemplateProps {
  product: MockProduct;
}

export function ProductTemplate({ product }: ProductTemplateProps) {
  const [imgError, setImgError] = useState(false);
  const { theme, basePath } = useTheme();
  const { colors } = theme;
  const showImage = product.imageUrl && !imgError;

  const relatedProducts = theme.products.filter((p) => p.id !== product.id).slice(0, 3);

  const breadcrumbItems = [
    { title: 'Accueil', href: basePath },
    { title: 'Produits', href: `${basePath}/products` },
    { title: product.name, href: '#' },
  ];

  return (
    <Container size="lg" py="xl">
      <Breadcrumbs mb="xl" style={{ color: colors.text }}>
        {breadcrumbItems.map((item) =>
          item.href === '#' ? (
            <Text key={item.title} size="sm" c="dimmed">
              {item.title}
            </Text>
          ) : (
            <Link
              key={item.title}
              href={item.href}
              style={{ fontSize: 14, color: colors.primary, textDecoration: 'none' }}
            >
              {item.title}
            </Link>
          )
        )}
      </Breadcrumbs>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box
            style={{
              height: 400,
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              background: showImage ? undefined : `linear-gradient(145deg, ${colors.primary}20, ${colors.accent}30)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showImage ? (
              <Image
                src={product.imageUrl!}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                onError={() => setImgError(true)}
                unoptimized={!product.imageUrl?.includes('images.unsplash.com')}
              />
            ) : (
              <span style={{ fontSize: 120 }}>{product.imagePlaceholder}</span>
            )}
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md" style={{ color: colors.text }}>
            {product.name}
          </Title>
          <Text size="xl" fw={700} mb="lg" style={{ color: colors.accent }}>
            {product.priceLabel}
          </Text>
          <Text size="md" mb="xl" style={{ color: colors.text }}>
            {product.description}
          </Text>

          <NumberInput
            label="Quantité"
            placeholder="1"
            min={1}
            defaultValue={1}
            mb="lg"
          />

          <Button
            size="lg"
            style={{ backgroundColor: colors.primary }}
            fullWidth
          >
            Ajouter au panier
          </Button>

          <Box mt="xl">
            <Text size="sm" c="dimmed" mb="xs">
              ✓ Livraison en Zone CFA
            </Text>
            <Text size="sm" c="dimmed" mb="xs">
              ✓ Paiement Mobile Money (Orange, MTN, Moov)
            </Text>
            <Text size="sm" c="dimmed">
              ✓ Retours sous 14 jours
            </Text>
          </Box>

          <Button
            component={Link}
            href={`${basePath}/products`}
            variant="subtle"
            mt="xl"
          >
            ← Retour aux produits
          </Button>
        </Grid.Col>
      </Grid>

      {relatedProducts.length > 0 && (
        <>
          <Divider my="xl" />
          <Title order={3} mb="lg" style={{ color: colors.text }}>
            Vous aimerez aussi
          </Title>
          <Grid gutter="lg">
            {relatedProducts.map((p) => (
              <Grid.Col key={p.id} span={{ base: 12, sm: 6, md: 4 }}>
                <ProductCard product={p} basePath={basePath} />
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
