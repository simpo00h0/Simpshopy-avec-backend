'use client';

import { useState } from 'react';
import { Container, Title, Text, TextInput, Button, Box } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function NewsletterSection() {
  const { theme } = useTheme();
  const { newsletterTitle, colors } = theme;
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Inscription bientôt disponible.');
  };

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
          {newsletterTitle ?? 'Restez informé'}
        </Title>
        <Text size="sm" ta="center" opacity={0.9} mb="lg">
          Inscrivez-vous pour recevoir nos offres et nouveautés.
        </Text>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            type="email"
            style={{ flex: '1 1 200px', maxWidth: 320 }}
            styles={{
              input: { backgroundColor: 'rgba(255,255,255,0.95)', border: 'none' },
            }}
          />
          <Button variant="white" color="dark" size="md" type="submit">
            S&apos;inscrire
          </Button>
        </Box>
        {message && (
          <Text size="sm" ta="center" mt="sm" opacity={0.9}>
            {message}
          </Text>
        )}
      </Container>
    </section>
  );
}
