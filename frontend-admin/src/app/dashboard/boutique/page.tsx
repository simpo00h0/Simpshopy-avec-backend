'use client';

import { useEffect } from 'react';
import { Container, Title, Text, Card, Group, Button, Box, Badge, Stack, Tabs } from '@mantine/core';
import { IconShoppingBag, IconEye, IconPalette, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { loadStores } from '@/lib/store-service';
import { getStoreUrl } from '@/lib/storefront-url';
import { THEME_NAMES } from '@/lib/constants';

export default function BoutiquePage() {
  const currentStore = useStoreStore((s) => s.currentStore);
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const themeId = currentStore?.settings?.themeId ?? null;
  const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';

  useEffect(() => {
    if (currentStore != null) return;
    loadStores().then(({ first }) => {
      if (first) setCurrentStore(first as Store);
    });
  }, [currentStore, setCurrentStore]);

  if (!themeId) {
    return (
      <Container fluid py="xl">
        <Title order={2} mb="xl">
          Boutique
        </Title>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="center" py={40}>
            <div style={{ textAlign: 'center' }}>
              <IconShoppingBag size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
              <Text size="lg" fw={500} mt="md">
                Choisissez d&apos;abord un thème
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Pour personnaliser votre boutique, sélectionnez un template dans l&apos;onglet Thèmes.
              </Text>
              <Button component={Link} href="/dashboard/themes" color="green" mt="md">
                Choisir un thème
              </Button>
            </div>
          </Group>
        </Card>
      </Container>
    );
  }

  const themeName = THEME_NAMES[themeId] ?? themeId;
  const storeSlug = currentStore?.slug ?? '';
  const storeUrl = getStoreUrl(storeSlug);
  const storefrontDomain = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || 'localhost:3002';
  const storeDisplayUrl = storefrontDomain.includes('localhost')
    ? `${storeSlug}.${storefrontDomain}`
    : `${storeSlug}.${storefrontDomain}`;
  const previewUrl = `${storefrontUrl}/preview/${themeId}`;

  return (
    <Container fluid py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Boutique</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Thème actuel et personnalisation
          </Text>
        </div>
        <Group>
          <Button
            component="a"
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            leftSection={<IconEye size={18} />}
            color="green"
          >
            Voir ma boutique
          </Button>
        </Group>
      </Group>

      <Tabs defaultValue="theme">
        <Tabs.List>
          <Tabs.Tab value="theme" leftSection={<IconPalette size={16} />}>
            Thème
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Paramètres
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="theme" pt="lg">
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" wrap="wrap">
                <div>
                  <Group gap="xs">
                    <Text fw={600}>Thème actif</Text>
                    <Badge color="green">{themeName}</Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mt={4}>
                    Ce thème définit l&apos;apparence de votre boutique en ligne.
                  </Text>
                  <Text size="sm" fw={500} mt="md">
                    Votre boutique :{' '}
                    <a href={storeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mantine-color-green-7)' }}>
                      {storeDisplayUrl}
                    </a>
                  </Text>
                </div>
                <Group>
                  <Button
                    component="a"
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={<IconEye size={16} />}
                    color="green"
                  >
                    Voir ma boutique
                  </Button>
                  <Button
                    component="a"
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={<IconEye size={16} />}
                    variant="light"
                  >
                    Aperçu thème seul
                  </Button>
                </Group>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Constructeur de boutique
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                Cliquez sur « Personnaliser » pour ouvrir votre boutique en mode édition. Chaque bloc (en-tête, bannière, produits, etc.) est cliquable pour le modifier.
              </Text>
              <Button
                component={Link}
                href={currentStore?.id ? `/dashboard/boutique/editor?storeId=${currentStore.id}` : '/dashboard/boutique/editor'}
                color="green"
                size="lg"
                leftSection={<IconPalette size={20} />}
              >
                Personnaliser ma boutique
              </Button>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group>
                <IconPalette size={24} />
                <div>
                  <Text fw={500}>Changer de thème</Text>
                  <Text size="sm" c="dimmed">
                    Vous souhaitez un autre style ? Rendez-vous dans l&apos;onglet Thèmes pour choisir un autre template.
                  </Text>
                  <Button component={Link} href="/dashboard/themes" variant="light" size="xs" mt="xs">
                    Voir les thèmes
                  </Button>
                </div>
              </Group>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed" mb="md">
              Informations générales, logo, bannière, domaine personnalisé.
            </Text>
            <Button component={Link} href="/dashboard/settings" color="green">
              Ouvrir les paramètres
            </Button>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
