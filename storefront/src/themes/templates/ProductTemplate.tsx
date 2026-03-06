'use client';

import { Container, Title, Text, Button, Grid, Box, NumberInput, Divider, Group, Stack } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';
import { useCartStore } from '@/stores/cartStore';
import { ProductCard } from '../sections/ProductCard';
import type { MockProduct, MockVariant } from '../theme-types';

interface ProductTemplateProps {
  product: MockProduct;
}

function findVariant(
  variants: MockVariant[],
  selectedOptions: Record<string, string>
): MockVariant | undefined {
  return variants.find((v) =>
    Object.entries(selectedOptions).every(
      ([name, value]) => (v.attributes as Record<string, string>)[name] === value
    )
  );
}

export function ProductTemplate({ product }: ProductTemplateProps) {
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, basePath, storeSubdomain } = useTheme();
  const addItem = useCartStore((s) => s.addItem);
  const { colors } = theme;

  const hasVariants = product.variants && product.variants.length > 0 && product.options && product.options.length > 0;
  const initialOptions = useMemo(() => {
    if (!hasVariants || !product.variants?.length) return {};
    const first = product.variants[0];
    return (first.attributes as Record<string, string>) ?? {};
  }, [hasVariants, product.variants]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  useEffect(() => {
    setSelectedOptions(initialOptions);
  }, [product.id]);

  const selectedVariant = useMemo(
    () => (hasVariants && product.variants ? findVariant(product.variants, selectedOptions) : undefined),
    [hasVariants, product.variants, selectedOptions]
  );

  const gallery = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const mainImage = selectedVariant?.imageUrl ?? gallery[selectedIndex];
  const showImage = mainImage && !imgError;

  const relatedProducts = theme.products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box>
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
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                  unoptimized={!mainImage?.includes('images.unsplash.com')}
                />
              ) : (
                <span style={{ fontSize: 120 }}>{product.imagePlaceholder}</span>
              )}
              {gallery.length > 1 && (
                <>
                  {selectedIndex > 0 && (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setSelectedIndex(selectedIndex - 1);
                        setImgError(false);
                      }}
                      aria-label="Image précédente"
                      style={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: '#333',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <IconChevronLeft size={24} stroke={2} />
                    </Box>
                  )}
                  {selectedIndex < gallery.length - 1 && (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setSelectedIndex(selectedIndex + 1);
                        setImgError(false);
                      }}
                      aria-label="Image suivante"
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: '#333',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <IconChevronRight size={24} stroke={2} />
                    </Box>
                  )}
                </>
              )}
            </Box>
            {gallery.length > 1 && (
              <Box
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 8,
                  overflowX: 'auto',
                  paddingBottom: 4,
                }}
              >
                {gallery.map((url, i) => (
                  <Box
                    key={url}
                    component="button"
                    type="button"
                    onClick={() => {
                      setSelectedIndex(i);
                      setImgError(false);
                    }}
                    style={{
                      flex: '0 0 64px',
                      height: 64,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: `2px solid ${i === selectedIndex ? colors.primary : 'var(--mantine-color-default-border)'}`,
                      cursor: 'pointer',
                      padding: 0,
                      background: 'transparent',
                    }}
                  >
                    <Image
                      src={url}
                      alt=""
                      width={64}
                      height={64}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      unoptimized={!url?.includes('images.unsplash.com')}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md" style={{ color: colors.text }}>
            {product.name}
          </Title>
          <Text size="xl" fw={700} mb="md" style={{ color: colors.accent }}>
            {selectedVariant ? selectedVariant.priceLabel : product.priceLabel}
          </Text>
          <Text size="md" mb="lg" style={{ color: colors.text }}>
            {product.description}
          </Text>

          {hasVariants && product.options && (
            <Stack gap="sm" mb="lg">
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <Text size="sm" fw={500} mb="xs" style={{ color: colors.text }}>
                    {opt.name}
                  </Text>
                  <Group gap="xs" wrap="wrap">
                    {opt.values.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      return (
                        <Box
                          key={val}
                          component="button"
                          type="button"
                          onClick={() => {
                            setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }));
                            setImgError(false);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 6,
                            border: `2px solid ${isSelected ? colors.primary : 'var(--mantine-color-default-border)'}`,
                            background: isSelected ? `${colors.primary}20` : undefined,
                            color: colors.text,
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {val}
                        </Box>
                      );
                    })}
                  </Group>
                </div>
              ))}
            </Stack>
          )}

          <NumberInput
            label="Quantité"
            placeholder="1"
            min={1}
            value={quantity}
            onChange={(v) => setQuantity(typeof v === 'string' ? 1 : (v ?? 1))}
            mb="lg"
          />

          {selectedVariant && selectedVariant.inventoryQty <= 0 && (
            <Text size="sm" c="red" mb="sm">
              Rupture de stock pour cette variante
            </Text>
          )}
          <Button
            size="lg"
            style={{ backgroundColor: colors.primary }}
            fullWidth
            disabled={
              (hasVariants && !selectedVariant) ||
              !!(selectedVariant && selectedVariant.inventoryQty <= 0)
            }
            onClick={() =>
              addItem(product, quantity, storeSubdomain, selectedVariant?.id)
            }
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
            href={basePath ? `${basePath}/collections/all` : '/collections/all'}
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
