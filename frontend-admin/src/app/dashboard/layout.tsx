'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell, Group, Title, Text, Button, Burger, Skeleton, NavLink, Stack, Divider, TextInput, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconHome2,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconWallet,
  IconBuildingStore,
  IconDiscount2,
  IconSearch,
  IconBell,
  IconShoppingBag,
  IconPalette,
} from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import { supabase } from '@/lib/supabase';
import { api, primeTokenCache } from '@/lib/api';
import { getStoreUrl } from '@/lib/storefront-url';
import {
  prefetchDashboardStats,
  prefetchProducts,
  prefetchOrders,
  prefetchCustomers,
  prefetchStores,
} from '@/lib/prefetch';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, logout, setUser } = useAuthStore();
  const currentStore = useStoreStore((s) => s.currentStore);
  const [opened, { toggle }] = useDisclosure();
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const run = async () => {
      let session;
      try {
        const { data } = await supabase.auth.getSession();
        session = data.session;
      } catch {
        await supabase.auth.signOut();
        logout();
        setHasSession(false);
        router.replace('/login');
        return;
      }
      if (!session) {
        setHasSession(false);
        router.replace('/login');
        return;
      }
      if (session.access_token) primeTokenCache(session.access_token);
      setHasSession(true);
      try {
        const [storesRes, meRes] = await Promise.all([
          api.get<{ id: string; name: string; slug: string; email: string; status: string }[]>('/stores'),
          api.get('/auth/me').catch(() => null),
        ]);
        if (meRes?.data) setUser(meRes.data);
        const stores = storesRes.data;
        setHasStore(stores != null && stores.length > 0);
        if (stores?.length) useStoreStore.getState().setCurrentStore(stores[0]);
      } catch {
        setHasStore(false);
      }
    };
    run();
  }, [router, logout]);

  useEffect(() => {
    if (hasStore === false) {
      router.replace('/onboarding');
    }
  }, [hasStore, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Accueil', icon: IconHome2, onPrefetch: () => prefetchDashboardStats(queryClient) },
    { href: '/dashboard/boutique', label: 'Boutique', icon: IconShoppingBag, onPrefetch: () => prefetchStores(queryClient) },
    { href: '/dashboard/themes', label: 'Thèmes', icon: IconPalette, onPrefetch: () => prefetchStores(queryClient) },
    { href: '/dashboard/orders', label: 'Commandes', icon: IconShoppingCart, onPrefetch: () => prefetchOrders(queryClient) },
    { href: '/dashboard/products', label: 'Produits', icon: IconPackage, onPrefetch: () => prefetchProducts(queryClient) },
    { href: '/dashboard/customers', label: 'Clients', icon: IconUsers, onPrefetch: () => prefetchCustomers(queryClient) },
    { href: '/dashboard/discounts', label: 'Réductions', icon: IconDiscount2 },
    { href: '/dashboard/analytics', label: 'Analytiques', icon: IconChartBar },
    { href: '/dashboard/wallet', label: 'Portefeuille', icon: IconWallet },
  ];

  const navBottom = [
    { href: '/dashboard/settings', label: 'Paramètres', icon: IconSettings },
    { href: '/', label: 'Retour au site', icon: IconBuildingStore },
  ];

  if (!hasSession || hasStore === null || hasStore === false) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Title order={4} c="green.7">
              Simpshopy
            </Title>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Skeleton height={200} />
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Title order={4} c="green.7">
                Simpshopy
              </Title>
            </Link>
            <TextInput
              placeholder="Rechercher commandes, produits..."
              leftSection={<IconSearch size={16} />}
              size="xs"
              style={{ maxWidth: 280 }}
              visibleFrom="md"
            />
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" size="lg">
              <IconBell size={20} />
            </ActionIcon>
            {currentStore && (
              <Button
                component="a"
                href={getStoreUrl(currentStore.slug)}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                size="xs"
                leftSection={<IconBuildingStore size={16} />}
              >
                Voir ma boutique
              </Button>
            )}
            <Text size="sm" c="dimmed">
              {user?.firstName}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Stack gap={4}>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href + '/'))}
                variant="subtle"
                onMouseEnter={item.onPrefetch}
              />
            ))}
          </Stack>
        </AppShell.Section>
        <Divider my="sm" />
        <AppShell.Section>
          <Stack gap={4}>
            {navBottom.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href + '/'))}
                variant="subtle"
              />
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        p={pathname?.includes('/boutique/editor') ? 0 : 'md'}
        className={pathname?.includes('/boutique/editor') ? styles.editorMain : undefined}
        style={pathname?.includes('/boutique/editor') ? { overflow: 'hidden' } : undefined}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
