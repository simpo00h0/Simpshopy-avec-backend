'use client';

import { Container, Title, Text, Card, Stack } from '@mantine/core';
import { IconDiscount2 } from '@tabler/icons-react';

export default function DiscountsPage() {
  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">
        Réductions
      </Title>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack align="center" py={60} gap="md">
          <IconDiscount2 size={56} stroke={1.5} color="var(--mantine-color-gray-4)" />
          <div style={{ textAlign: 'center' }}>
            <Text size="lg" fw={500}>
              Codes promo et réductions
            </Text>
            <Text size="sm" c="dimmed" mt="xs" maw={400}>
              Créez des codes de réduction (pourcentage ou montant fixe), des promotions de type « achetez X obtenez Y » ou une livraison gratuite. Cette fonctionnalité arrive prochainement.
            </Text>
            <Text size="xs" c="dimmed" mt="md">
              Inspiré de Shopify : codes à usage unique ou multiple, limites par client, dates de validité.
            </Text>
          </div>
        </Stack>
      </Card>
    </Container>
  );
}
