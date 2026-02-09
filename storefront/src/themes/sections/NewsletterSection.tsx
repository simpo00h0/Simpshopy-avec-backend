'use client';

import { Container, Title, Text, TextInput, Button, Box } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function NewsletterSection() {
  const { theme } = useTheme();
  const { newsletterTitle, colors } = theme;

  const title = newsletterTitle ?? 'Restez informé';
  const subtext = 'Inscrivez-vous pour recevoir nos offres et nouveautés.';

  return (
    <section
      style={{
        padding: '48px 0',
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white',
      }}
    >
      <Container size="sm">
        <Title order={2} ta="center" mb="xs">
          {title}
        </Title>
        <Text size="sm" ta="center" opacity={0.9} mb="lg">
          {subtext}
        </Text>
        <Box
          component="form"
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <TextInput
            placeholder="Votre email"
            size="md"
            style={{ flex: '1 1 200px', maxWidth: 320 }}
            styles={{
              input: { backgroundColor: 'rgba(255,255,255,0.95)', border: 'none' },
            }}
          />
          <Button variant="white" color="dark" size="md">
            S&apos;inscrire
          </Button>
        </Box>
      </Container>
    </section>
  );
}
