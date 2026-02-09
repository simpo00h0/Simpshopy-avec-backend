'use client';

import { Container, Title, Text, Button, Card, Group, Box, Table, Grid } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';

export function CartTemplate() {
  const { theme, basePath } = useTheme();
  const { colors, products } = theme;

  const cartEmpty = true;

  if (cartEmpty) {
    return (
      <Container size="md" py="xl">
        <Title order={2} mb="xl" style={{ color: colors.text }}>
          Votre panier
        </Title>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Box ta="center" py={40}>
            <Text size="xl" c="dimmed" mb="md">
              Votre panier est vide
            </Text>
            <Text size="sm" c="dimmed" mb="xl">
              Découvrez nos produits et ajoutez-les à votre panier
            </Text>
            <Button
              component={Link}
              href={`${basePath}/products`}
              size="lg"
              style={{ backgroundColor: colors.primary }}
            >
              Voir les produits
            </Button>
          </Box>
        </Card>
        <Group justify="space-between" mt="xl">
          <Button component={Link} href={basePath} variant="subtle">
            ← Continuer mes achats
          </Button>
        </Group>
      </Container>
    );
  }

  const sampleProduct = products[0];

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl" style={{ color: colors.text }}>
        Votre panier
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder mb="lg">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Produit</Table.Th>
                  <Table.Th>Prix</Table.Th>
                  <Table.Th>Qté</Table.Th>
                  <Table.Th>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <Group>
                      <Box
                        w={60}
                        h={60}
                        style={{
                          position: 'relative',
                          borderRadius: 4,
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: `linear-gradient(145deg, ${colors.primary}20, ${colors.accent}30)`,
                        }}
                      >
                        {sampleProduct.imageUrl ? (
                          <Image
                            src={sampleProduct.imageUrl}
                            alt={sampleProduct.name}
                            fill
                            sizes="60px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                            {sampleProduct.imagePlaceholder}
                          </Box>
                        )}
                      </Box>
                      <Text fw={500}>{sampleProduct.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{sampleProduct.priceLabel}</Table.Td>
                  <Table.Td>1</Table.Td>
                  <Table.Td>{sampleProduct.priceLabel}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={600} mb="sm">
              Récapitulatif
            </Text>
            <Group justify="space-between" mb="xs">
              <Text size="sm">Sous-total</Text>
              <Text size="sm">{sampleProduct.priceLabel}</Text>
            </Group>
            <Group justify="space-between" mb="md">
              <Text size="sm">Livraison</Text>
              <Text size="sm">Calculée à l&apos;étape suivante</Text>
            </Group>
            <Group justify="space-between" mb="lg">
              <Text fw={700}>Total</Text>
              <Text fw={700} style={{ color: colors.accent }}>
                {sampleProduct.priceLabel}
              </Text>
            </Group>
            <Button
              component={Link}
              href={`${basePath}/products`}
              fullWidth
              size="lg"
              style={{ backgroundColor: colors.primary }}
            >
              Passer commande
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
      <Group justify="space-between" mt="xl">
        <Button component={Link} href={basePath} variant="subtle">
          ← Continuer mes achats
        </Button>
      </Group>
    </Container>
  );
}
