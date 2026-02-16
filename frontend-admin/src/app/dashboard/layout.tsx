'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useDashboardAuth } from './hooks/useDashboardAuth';
import { useDashboardNavigation } from './hooks/useDashboardNavigation';
import { useDashboardPrefetch } from './hooks/useDashboardPrefetch';
import { getNavItems, getNavBottom } from './dashboard-nav-config';
import { DashboardShell } from './components/DashboardShell';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const currentStore = useStoreStore((s) => s.currentStore);
  const { hasSession, hasStore } = useDashboardAuth();
  const { setNavigatingTo, showNavLoader, navigatingTo } = useDashboardNavigation();
  const [opened, { toggle }] = useDisclosure();

  useDashboardPrefetch(hasSession ?? false, hasStore ?? false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/');
  };

  const prefetchRoute = (href: string) => router.prefetch(href);
  const navItems = getNavItems(prefetchRoute, queryClient);
  const navBottom = getNavBottom(prefetchRoute);

  const mainContent =
    hasStore === null || hasStore === false
      ? <LoadingScreen />
      : showNavLoader && navigatingTo
        ? <LoadingScreen />
        : children;

  if (!hasSession) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Title order={4} c="green.7">Simpshopy</Title>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <LoadingScreen />
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <DashboardShell
      opened={opened}
      onToggle={toggle}
      pathname={pathname}
      navItems={navItems}
      navBottom={navBottom}
      onNavClick={setNavigatingTo}
      userFirstName={user?.firstName}
      storeSlug={currentStore?.slug}
      onLogout={handleLogout}
      isEditorPath={pathname?.includes('/boutique/editor') ?? false}
      styles={{ editorMain: styles.editorMain, appShellMain: styles.appShellMain }}
    >
      {mainContent}
    </DashboardShell>
  );
}
