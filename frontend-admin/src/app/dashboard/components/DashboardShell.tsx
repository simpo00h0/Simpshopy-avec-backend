'use client';

import Link from 'next/link';
import {
  AppShell,
  Group,
  Title,
  Text,
  Button,
  Burger,
  NavLink,
  Stack,
  Divider,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconBell, IconBuildingStore, IconLogout } from '@tabler/icons-react';
import { getStoreUrl } from '@/lib/storefront-url';
import type { NavItem } from '../dashboard-nav-config';

type DashboardShellProps = {
  opened: boolean;
  onToggle: () => void;
  pathname: string | null;
  navItems: NavItem[];
  navBottom: NavItem[];
  onNavClick: (href: string) => void;
  userFirstName?: string;
  storeSubdomain?: string;
  onLogout: () => void;
  children: React.ReactNode;
  isEditorPath: boolean;
  styles: { editorMain: string; appShellMain: string };
};

export function DashboardShell({
  opened,
  onToggle,
  pathname,
  navItems,
  navBottom,
  onNavClick,
  userFirstName,
  storeSubdomain,
  onLogout,
  children,
  isEditorPath,
  styles,
}: DashboardShellProps) {
  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && href !== '/' && pathname?.startsWith(href + '/'));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
          <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Title order={4} c="green.7">
                Simpshopy
              </Title>
            </Link>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <Tooltip label="Notifications (bientôt)">
              <ActionIcon variant="subtle" size="lg">
                <IconBell size={20} />
              </ActionIcon>
            </Tooltip>
            {storeSubdomain && (
              <Button
                component="a"
                href={getStoreUrl(storeSubdomain)}
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
              {userFirstName}
            </Text>
            <Button variant="subtle" size="xs" leftSection={<IconLogout size={16} />} onClick={onLogout}>
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
                prefetch={false}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={isActive(item.href)}
                variant="subtle"
                onMouseEnter={item.onPrefetch}
                onClick={() => onNavClick(item.href)}
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
                prefetch={false}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={isActive(item.href)}
                variant="subtle"
                onMouseEnter={item.onPrefetch}
                onClick={() => onNavClick(item.href)}
              />
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        p={isEditorPath ? 0 : 'md'}
        className={isEditorPath ? styles.editorMain : styles.appShellMain}
        style={isEditorPath ? { overflow: 'hidden' } : undefined}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
