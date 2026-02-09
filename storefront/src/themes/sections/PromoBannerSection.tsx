'use client';

import { Container, Text, Group } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';

export function PromoBannerSection() {
  const { theme } = useTheme();
  const { promoBanner, colors } = theme;

  if (!promoBanner) return null;

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
