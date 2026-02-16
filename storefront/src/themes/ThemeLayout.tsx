'use client';

import { useState } from 'react';
import { Container, Title, Text, Group, Button, Box, Burger, Drawer, Stack } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './ThemeContext';
import { BlockWrapper } from './BlockWrapper';

export function ThemeLayout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const { theme, basePath, isPreview } = useTheme();
  const { storeName, logo, footerTagline, footerLinks, colors } = theme;

  const navLinks = [
    { label: 'Accueil', href: basePath },
    { label: 'Produits', href: `${basePath}/collections/all` },
    { label: 'À propos', href: `${basePath}/about` },
    { label: 'Contact', href: `${basePath}/contact` },
    { label: 'Panier', href: `${basePath}/cart` },
  ];

  const NavContent = () => (
    <>
      {navLinks.slice(0, -1).map((link) => (
        <Text
          key={link.href}
          size="sm"
          component={Link}
          href={link.href}
          onClick={() => setOpened(false)}
          style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}
        >
          {link.label}
        </Text>
      ))}
    </>
  );

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <style>{`.skip-link { position: absolute; left: -9999px; z-index: 9999; padding: 8px 12px; color: white; border-radius: 4px; }.skip-link:focus { left: 16px; top: 16px; }`}</style>
      <a
        href="#main-content"
        className="skip-link"
        style={{ backgroundColor: colors.primary }}
      >
        Aller au contenu principal
      </a>
      {/* Header */}
      <BlockWrapper blockId="header" label="En-tête & logo">
      <Box
        component="header"
        py="md"
        px="xl"
        style={{
          backgroundColor: colors.primary,
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl">
          <Group justify="space-between">
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color="white"
              aria-label="Menu"
              hiddenFrom="sm"
            />
            {logo ? (
              <Link href={basePath} style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={logo} alt={storeName} width={120} height={36} style={{ objectFit: 'contain' }} unoptimized />
              </Link>
            ) : (
              <Link href={basePath} style={{ color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                <Title order={3} component="span">
                  {storeName}
                </Title>
              </Link>
            )}
            <Group gap="lg" visibleFrom="sm">
              <NavContent />
              <Button
                component={Link}
                href={`${basePath}/cart`}
                variant="white"
                color="dark"
                size="sm"
                leftSection={<IconShoppingCart size={16} />}
              >
                Panier (0)
              </Button>
            </Group>
            <Group hiddenFrom="sm">
              <Button
                component={Link}
                href={`${basePath}/cart`}
                variant="white"
                color="dark"
                size="xs"
                leftSection={<IconShoppingCart size={14} />}
              >
                Panier
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>
      </BlockWrapper>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={storeName}
        position="left"
        styles={{
          header: { backgroundColor: colors.primary, color: 'white' },
          body: { backgroundColor: colors.primary },
        }}
      >
        <Stack gap="lg">
          {navLinks.map((link) => (
            <Text
              key={link.href}
              size="md"
              component={Link}
              href={link.href}
              onClick={() => setOpened(false)}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              {link.label}
            </Text>
          ))}
        </Stack>
      </Drawer>

      {/* Main content */}
      <main id="main-content" tabIndex={-1}>{children}</main>

      {/* Footer */}
      <BlockWrapper blockId="footer" label="Pied de page">
      <Box
        component="footer"
        py="xl"
        mt="auto"
        style={{
          backgroundColor: colors.primary,
          color: 'white',
        }}
      >
        <Container size="xl">
          {footerLinks && footerLinks.length > 0 && (
            <Group justify="center" gap="xl" mb="md" wrap="wrap">
              {footerLinks.map((link) => (
                <Text
                  key={link.label}
                  size="sm"
                  component={Link}
                  href={link.href.startsWith('/') ? `${basePath}${link.href === '/' ? '' : link.href}` : link.href}
                  style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}
                >
                  {link.label}
                </Text>
              ))}
            </Group>
          )}
          <Text size="sm" ta="center" opacity={0.9}>
            {footerTagline}
          </Text>
          {isPreview && (
            <Text size="xs" ta="center" mt="sm" opacity={0.7}>
              Aperçu du thème — Données fictives
            </Text>
          )}
        </Container>
      </Box>
      </BlockWrapper>
    </Box>
  );
}
