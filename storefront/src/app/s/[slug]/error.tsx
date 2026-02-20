'use client';

import { useEffect } from 'react';
import { Container, Title, Text, Button } from '@mantine/core';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storefront] Erreur boutique:', error);
    }
  }, [error]);

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md" ta="center">
        Erreur de chargement
      </Title>
      <Text c="dimmed" ta="center" mb="xl">
        Impossible de charger cette boutique. Vérifiez que le backend est démarré et que la boutique existe.
      </Text>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={reset}>Réessayer</Button>
      </div>
    </Container>
  );
}
