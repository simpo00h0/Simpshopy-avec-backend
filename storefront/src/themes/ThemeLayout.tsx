'use client';

import { useState } from 'react';
import { Container, Title, Text, Group, Box, Burger, Drawer, Stack, UnstyledButton } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './ThemeContext';
import { BlockWrapper } from './BlockWrapper';
import { FaviconUpdater } from './FaviconUpdater';
import { useCartStore } from '@/stores/cartStore';

export function ThemeLayout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const { theme, basePath, isPreview, storeSubdomain } = useTheme();
  const getItems = useCartStore((s) => s.getItems);
  const cartCount = getItems(storeSubdomain).reduce((sum, i) => sum + i.quantity, 0);
  const { storeName, logo, logoAlignment, logoBlockId, footerTagline, footerLinks, colors } = theme;
  const logoAlign = logoAlignment ?? 'left';

  const navLinks = [
    { label: 'Accueil', href: basePath },
    { label: 'Produits', href: `${basePath}/collections/all` },
    { label: 'À propos', href: `${basePath}/about` },
    { label: 'Contact', href: `${basePath}/contact` },
    { label: 'Panier', href: `${basePath}/cart` },
  ];

  const NavContent = () => (
    <Group gap="lg" visibleFrom="sm">
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
    </Group>
  );

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <FaviconUpdater />
      <style>{`.skip-link { position: absolute; left: -9999px; z-index: 9999; padding: 8px 12px; color: white; border-radius: 4px; }.skip-link:focus { left: 16px; top: 16px; }`}</style>
      <a
        href="#main-content"
        className="skip-link"
        style={{ backgroundColor: colors.primary }}
      >
        Aller au contenu principal
      </a>
      {/* Header */}
      <BlockWrapper blockId={logoBlockId ?? 'header'} label="Logo & favicon">
      <Box
        component="header"
        py="md"
        pl="xl"
        pr="xs"
        style={{
          backgroundColor: colors.primary,
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl" px={0}>
          <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
            <Box style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: 0 }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color="white"
                aria-label="Menu"
                hiddenFrom="sm"
              />
              <Box
                visibleFrom="sm"
                style={{
                  display: 'flex',
                  justifyContent: logoAlign === 'left' ? 'flex-start' : logoAlign === 'center' ? 'center' : 'flex-end',
                  flex: 1,
                }}
              >
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
              </Box>
            </Box>
            <Box style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
              <Box hiddenFrom="sm" style={{ display: 'flex', justifyContent: 'center' }}>
                {logo ? (
                  <Link href={basePath} style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={logo} alt={storeName} width={100} height={30} style={{ objectFit: 'contain' }} unoptimized />
                  </Link>
                ) : (
                  <Link href={basePath} style={{ color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '1.1rem' }}>
                    {storeName}
                  </Link>
                )}
              </Box>
              <NavContent />
            </Box>
            <Box style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minWidth: 0 }}>
              <UnstyledButton
                component={Link}
                href={`${basePath}/cart`}
                aria-label={`Panier${cartCount > 0 ? ` (${cartCount} article${cartCount > 1 ? 's' : ''})` : ''}`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: 6,
                }}
              >
                <IconShoppingCart size={22} stroke={1.5} style={{ display: 'block' }} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      minWidth: 16,
                      height: 16,
                      padding: '0 4px',
                      fontSize: 10,
                      fontWeight: 600,
                      lineHeight: '16px',
                      textAlign: 'center',
                      color: theme.colors.primary,
                      backgroundColor: 'white',
                      borderRadius: 8,
                    }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </UnstyledButton>
            </Box>
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
