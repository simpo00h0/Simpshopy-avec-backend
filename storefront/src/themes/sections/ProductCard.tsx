'use client';

import { Card, Title, Text, Button, Box } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import type { MockProduct } from '../data';

interface ProductCardProps {
  product: MockProduct;
  basePath: string;
}

export function ProductCard({ product, basePath }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { theme } = useTheme();
  const { colors } = theme;
  const showImage = product.imageUrl && !imgError;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        borderColor: colors.secondary + '30',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : undefined,
        boxShadow: hovered ? '0 8px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card.Section>
        <Link href={`${basePath}/products/${product.id}`}>
          <Box
            style={{
              height: 200,
              position: 'relative',
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
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
                onError={() => setImgError(true)}
                unoptimized={!product.imageUrl?.includes('images.unsplash.com')}
              />
            ) : (
              <span style={{ fontSize: 64 }}>{product.imagePlaceholder}</span>
            )}
          </Box>
        </Link>
      </Card.Section>
      <Link href={`${basePath}/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Title order={4} mt="md" style={{ color: colors.text }}>
          {product.name}
        </Title>
      </Link>
      <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
        {product.description}
      </Text>
      <Text size="xl" fw={700} mt="md" style={{ color: colors.accent }}>
        {product.priceLabel}
      </Text>
      <Button
        component={Link}
        href={`${basePath}/products/${product.id}`}
        fullWidth
        mt="md"
        radius="md"
        style={{ backgroundColor: colors.primary }}
      >
        Voir le produit
      </Button>
    </Card>
  );
}
