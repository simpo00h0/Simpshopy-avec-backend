'use client';

import { Container, Title, Text, Card, Group, SimpleGrid } from '@mantine/core';
import { IconChartBar, IconTrendingUp } from '@tabler/icons-react';

export default function AnalyticsPage() {
  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">
        Analytiques
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        {[
          { label: 'Ventes totales', value: '0 XOF', icon: IconTrendingUp },
          { label: 'Commandes', value: '0', icon: IconChartBar },
          { label: 'Clients', value: '0', icon: IconChartBar },
          { label: 'Panier moyen', value: '0 XOF', icon: IconChartBar },
        ].map((stat) => (
          <Card key={stat.label} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
              </div>
              <stat.icon size={28} stroke={1.5} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Text size="sm" c="dimmed" ta="center" py={40}>
          Les graphiques et rapports détaillés seront disponibles une fois que vous aurez des ventes.
        </Text>
      </Card>
    </Container>
  );
}
