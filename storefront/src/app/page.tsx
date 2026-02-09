'use client';

import { Container, Title, Text, Grid, Card, Button, Image } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg" ta="center">
        Bienvenue dans notre boutique
      </Title>
      <Text size="lg" c="dimmed" ta="center" mb="xl">
        Découvrez nos produits de qualité
      </Text>

      <Grid gutter="md">
        {/* Les produits seront chargés dynamiquement via l'API */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <div
                style={{
                  height: 200,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text c="dimmed">Image produit</Text>
              </div>
            </Card.Section>

            <Title order={4} mt="md">
              Nom du produit
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              Description du produit
            </Text>
            <Text size="xl" fw={700} mt="md">
              10,000 XOF
            </Text>
            <Button fullWidth mt="md" radius="md">
              Ajouter au panier
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
