'use client';

import { Container, Text, Group } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';

export function PromoBannerSection() {
  const { theme, isEditor } = useTheme();
  const { promoBanner, colors } = theme;

  if (!promoBanner) {
    if (isEditor) {
      return (
        <section style={{ backgroundColor: colors.accent, color: 'white', padding: '12px 0', textAlign: 'center' }}>
          <Container size="xl">
            <Text size="sm" opacity={0.9}>
              Choisissez un message promo dans le panneau Paramètres.
            </Text>
          </Container>
        </section>
      );
    }
    return null;
  }

  return (
    <section
      style={{
        backgroundColor: colors.accent,
        color: 'white',
        padding: '12px 0',
        textAlign: 'center',
      }}
    >
      <Container size="xl">
        <Group justify="center" gap="xs">
          <IconTruck size={18} />
          <Text size="sm" fw={500}>
            {promoBanner}
          </Text>
        </Group>
      </Container>
    </section>
  );
}
