'use client';

import { Container, SimpleGrid, Text, Box } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function TrustBadgesSection() {
  const { theme } = useTheme();
  const badges = theme.trustBadges?.items;
  if (!badges?.length) return null;

  return (
    <section
      style={{
        padding: '40px 0',
        backgroundColor: theme.colors.bg,
        borderTop: `1px solid ${theme.colors.secondary}20`,
      }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
          {badges.map((item, i) => (
            <Box key={i} ta="center">
              {item.icon && (
                <Text size="xl" mb="xs" style={{ fontSize: 28 }}>
                  {item.icon}
                </Text>
              )}
              <Text size="sm" fw={500} style={{ color: theme.colors.text }}>
                {item.text}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
