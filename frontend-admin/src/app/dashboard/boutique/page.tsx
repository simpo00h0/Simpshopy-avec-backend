'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Box,
  Badge,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { IconShoppingBag, IconPalette, IconExternalLink, IconChevronRight } from '@tabler/icons-react';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { loadStores } from '@/lib/store-service';
import { getStoreUrl } from '@/lib/storefront-url';
import { THEME_NAMES } from '@/lib/constants';

export default function BoutiquePage() {
  const router = useRouter();
  const currentStore = useStoreStore((s) => s.currentStore);
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const themeId = currentStore?.settings?.themeId ?? null;

  useEffect(() => {
    if (currentStore != null) return;
    loadStores().then(({ first }) => {
      if (first) setCurrentStore(first as Store);
    });
  }, [currentStore, setCurrentStore]);

  useEffect(() => {
    router.prefetch('/dashboard/boutique/editor');
  }, [router]);

  useEffect(() => {
    const sub = currentStore?.subdomain;
    if (!sub) return;
    const storefrontOrigin = new URL(getStoreUrl(sub)).origin;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = storefrontOrigin;
    document.head.appendChild(preconnect);
    const prefetchStorefront = document.createElement('link');
    prefetchStorefront.rel = 'prefetch';
    prefetchStorefront.href = `${storefrontOrigin}?editor=1`;
    document.head.appendChild(prefetchStorefront);
    return () => {
      preconnect.remove();
      prefetchStorefront.remove();
    };
  }, [currentStore?.subdomain]);

  if (!themeId) {
    return (
      <Container size="md" py="xl">
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 360,
            textAlign: 'center',
          }}
        >
          <IconShoppingBag size={64} stroke={1.2} color="var(--mantine-color-gray-3)" />
          <Title order={3} mt="lg" fw={600}>
            Choisissez un thème
          </Title>
          <Text size="sm" c="dimmed" mt="xs" maw={320}>
            Pour personnaliser votre boutique, sélectionnez d&apos;abord un template dans les thèmes.
          </Text>
          <Link href="/dashboard/themes" style={{ textDecoration: 'none', marginTop: 24 }}>
            <Button color="green" size="md" leftSection={<IconPalette size={18} />}>
              Voir les thèmes
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  const themeName = THEME_NAMES[themeId] ?? themeId;
  const subdomain = currentStore?.subdomain ?? '';
  const storeUrl = getStoreUrl(subdomain);
  const storefrontDomain = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || 'localhost:3002';
  const storeDisplayUrl = `${subdomain}.${storefrontDomain}`;

  return (
    <Container size="lg" py="md">
      {/* Thème actuel - iframe header + promo banner + hero */}
      <Card shadow="sm" padding={0} radius="md" withBorder style={{ overflow: 'hidden' }}>
        <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap="sm">
            <Badge color="green" variant="light" size="lg">
              Thème actif
            </Badge>
            <Text fw={600} size="lg">
              {themeName}
            </Text>
          </Group>
          <Group gap="xs">
            <Button
              component="a"
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="sm"
              leftSection={<IconExternalLink size={16} />}
            >
              Voir ma boutique
            </Button>
            <Link
              href={currentStore?.id ? `/dashboard/boutique/editor?storeId=${currentStore.id}` : '/dashboard/boutique/editor'}
              style={{ textDecoration: 'none' }}
            >
              <Button color="green" size="sm" leftSection={<IconPalette size={18} />}>
                Personnaliser
              </Button>
            </Link>
          </Group>
        </Group>

        <Box
          style={{
            height: 480,
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <iframe
            src={storeUrl}
            title="Aperçu : header, bannière promo et bannière principale"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </Box>

        <Group justify="space-between" p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Text size="xs" c="dimmed">
            {storeDisplayUrl}
          </Text>
        </Group>
      </Card>

      <Stack gap="xs" mt="lg">
        <UnstyledButton
          component={Link}
          href="/dashboard/themes"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: 'var(--mantine-color-gray-0)',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <Group gap="sm">
            <IconPalette size={20} color="var(--mantine-color-gray-6)" />
            <div style={{ textAlign: 'left' }}>
              <Text size="sm" fw={500}>
                Changer de thème
              </Text>
              <Text size="xs" c="dimmed">
                Choisir un autre template
              </Text>
            </div>
          </Group>
          <IconChevronRight size={18} color="var(--mantine-color-gray-5)" />
        </UnstyledButton>

        <UnstyledButton
          component={Link}
          href="/dashboard/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: 'var(--mantine-color-gray-0)',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <Group gap="sm">
            <IconShoppingBag size={20} color="var(--mantine-color-gray-6)" />
            <div style={{ textAlign: 'left' }}>
              <Text size="sm" fw={500}>
                Paramètres de la boutique
              </Text>
              <Text size="xs" c="dimmed">
                Logo, bannière, domaine personnalisé
              </Text>
            </div>
          </Group>
          <IconChevronRight size={18} color="var(--mantine-color-gray-5)" />
        </UnstyledButton>
      </Stack>
    </Container>
  );
}
