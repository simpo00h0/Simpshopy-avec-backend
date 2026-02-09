'use client';

import { Container, Title, Text } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function RichTextSection() {
  const { theme } = useTheme();
  const { richTextHeading, richTextContent, colors } = theme;

  if (!richTextHeading && !richTextContent) return null;

  return (
    <section
      style={{
        padding: '48px 0',
        backgroundColor: colors.bg,
      }}
    >
      <Container size="md">
        {richTextHeading && (
          <Title order={2} mb="md" style={{ color: colors.text }}>
            {richTextHeading}
          </Title>
        )}
        {richTextContent && (
          <Text size="md" c="dimmed" style={{ color: colors.text, opacity: 0.9 }}>
            {richTextContent}
          </Text>
        )}
      </Container>
    </section>
  );
}
