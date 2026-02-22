'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Container, Title, Text, Grid, Card, Group, Button, SimpleGrid, Box } from '@mantine/core';
import { IconShoppingBag, IconPackage, IconCurrencyDollar, IconUsers, IconCheck } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import { fetchDashboardStats } from '@/lib/prefetch';
import { getStoreUrl } from '@/lib/storefront-url';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const currentStore = useStoreStore((s) => s.currentStore);
  const { data: stats = { products: 0, orders: 0, revenue: 0, customers: 0 }, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
  });

  const hasTheme = !!currentStore?.settings?.themeId;
  const nextSteps: { num: string; title: string; desc: string; done: boolean; href: string }[] = [
    { num: '01', title: 'Ajouter un produit', desc: 'Créez votre premier produit et lancez vos ventes', done: stats.products > 0, href: '/dashboard/products' },
    { num: '02', title: 'Personnaliser la boutique', desc: 'Choisissez un thème et personnalisez votre vitrine', done: hasTheme, href: '/dashboard/themes' },
    { num: '03', title: 'Configurer les paiements', desc: 'Activez Mobile Money et les autres moyens de paiement', done: false, href: '/dashboard/settings' },
  ];

  return (
    <Container fluid py="xl">
      <Title order={1} mb="lg">
        Bienvenue, {user?.firstName || 'Vendeur'} !
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Title order={3} mb="md">
          Prochaines étapes
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Suivez ces étapes pour lancer votre boutique
        </Text>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {nextSteps.map((s) => (
            <Box
              key={s.num}
              p="md"
              style={{
                borderRadius: 8,
                border: '1px solid var(--mantine-color-gray-2)',
                backgroundColor: s.done ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-gray-0)',
              }}
            >
              <Group gap="sm" mb="xs">
                <Box
                  w={36}
                  h={36}
                  style={{
                    borderRadius: '50%',
                    background: s.done ? 'var(--mantine-color-green-2)' : 'var(--mantine-color-green-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.done ? (
                    <IconCheck size={20} color="var(--mantine-color-green-7)" />
                  ) : (
                    <Text fw={700} size="sm" c="green.7">
                      {s.num}
                    </Text>
                  )}
                </Box>
                <Text fw={600}>{s.title}</Text>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                {s.desc}
              </Text>
              <Link href={s.href} style={{ textDecoration: 'none' }}>
                <Button size="xs" color="green" variant="light">
                  {s.num === '01' ? 'Ajouter un produit' : s.num === '02' ? 'Personnaliser' : 'Configurer'}
                </Button>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Card>

      <Grid gutter="md">
        {[
          { title: 'Produits', value: isLoading ? '...' : stats.products.toString(), icon: IconPackage },
          { title: 'Commandes', value: isLoading ? '...' : stats.orders.toString(), icon: IconShoppingBag },
          { title: 'Revenus', value: isLoading ? '...' : `${stats.revenue.toLocaleString('fr-FR')} XOF`, icon: IconCurrencyDollar },
          { title: 'Clients', value: isLoading ? '...' : stats.customers.toString(), icon: IconUsers },
        ].map((stat) => (
          <Grid.Col key={stat.title} span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                </div>
                <stat.icon size={32} stroke={1.5} />
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Title order={3} mb="md">
          Actions rapides
        </Title>
        <Group>
          <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
            <Button>Ajouter un produit</Button>
          </Link>
          <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
            <Button variant="outline">Voir mes commandes</Button>
          </Link>
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <Button variant="outline">Paramètres de la boutique</Button>
          </Link>
          {currentStore && (
            <Button
              component="a"
              href={getStoreUrl(currentStore.subdomain)}
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
            >
              Voir ma boutique
            </Button>
          )}
        </Group>
      </Card>
    </Container>
  );
}
