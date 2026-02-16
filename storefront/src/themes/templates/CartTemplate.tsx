'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Box,
  Table,
  Grid,
  NumberInput,
  ActionIcon,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';
import { useCartStore } from '@/stores/cartStore';

export function CartTemplate() {
  const { theme, basePath, storeSubdomain } = useTheme();
  const { colors } = theme;
  const getItems = useCartStore((s) => s.getItems);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const items = getItems(storeSubdomain);
  const cartEmpty = items.length === 0;

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
              href={`${basePath}/collections/all`}
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

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const subtotalLabel = `${subtotal.toLocaleString('fr-FR')} XOF`;

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
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <Table.Tr key={`${item.productId}-${item.storeSubdomain}`}>
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
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="60px"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <Box
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                              }}
                            >
                              {item.imagePlaceholder}
                            </Box>
                          )}
                        </Box>
                        <Text fw={500}>{item.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{item.priceLabel}</Table.Td>
                    <Table.Td>
                      <NumberInput
                        min={1}
                        value={item.quantity}
                        onChange={(v) =>
                          updateQuantity(
                            item.productId,
                            typeof v === 'string' ? 1 : (v ?? 1),
                            storeSubdomain
                          )
                        }
                        w={80}
                        size="xs"
                      />
                    </Table.Td>
                    <Table.Td>
                      {(item.price * item.quantity).toLocaleString('fr-FR')} XOF
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => removeItem(item.productId, storeSubdomain)}
                        aria-label="Supprimer"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
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
              <Text size="sm">{subtotalLabel}</Text>
            </Group>
            <Group justify="space-between" mb="md">
              <Text size="sm">Livraison</Text>
              <Text size="sm">Calculée à l&apos;étape suivante</Text>
            </Group>
            <Group justify="space-between" mb="lg">
              <Text fw={700}>Total</Text>
              <Text fw={700} style={{ color: colors.accent }}>
                {subtotalLabel}
              </Text>
            </Group>
            <Button
              component={Link}
              href={`${basePath}/collections/all`}
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
