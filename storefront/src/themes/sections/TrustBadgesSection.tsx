'use client';

import { Container, SimpleGrid, Text, Box } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function TrustBadgesSection() {
  const { theme, isEditor } = useTheme();
  const badges = theme.trustBadges?.items;
  if (!badges?.length) {
    if (isEditor) {
      return (
        <section style={{ padding: '32px 0', backgroundColor: theme.colors.bg }}>
          <Container size="sm">
            <Text size="sm" ta="center" c="dimmed">Ajoutez des badges de confiance dans le panneau Paramètres.</Text>
          </Container>
        </section>
      );
    }
    return null;
  }

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
