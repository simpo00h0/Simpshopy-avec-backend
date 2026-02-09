'use client';

import { Container, Title, Text } from '@mantine/core';
import { useTheme } from '../ThemeContext';
import { BlockWrapper } from '../BlockWrapper';

export function AboutTemplate() {
  const { theme } = useTheme();
  const { storeName, aboutTitle, aboutContent, richTextContent, colors } = theme;

  const title = aboutTitle ?? 'À propos';
  const content = aboutContent ?? richTextContent ?? `Bienvenue chez ${storeName}.`;

  return (
    <BlockWrapper blockId="about" label="Page À propos">
    <Container size="md" py="xl">
      <Title order={1} mb="xl" style={{ color: colors.text }}>
        {title}
      </Title>
      <Text size="lg" style={{ color: colors.text }} mb="lg">
        {content}
      </Text>
      <Text size="sm" c="dimmed" style={{ color: colors.text }}>
        Simpshopy — Votre boutique en ligne en Zone CFA. Paiement Mobile Money, livraison rapide.
      </Text>
    </Container>
    </BlockWrapper>
  );
}
