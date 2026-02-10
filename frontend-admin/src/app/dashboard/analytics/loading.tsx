'use client';

import { Container, Skeleton, Group, SimpleGrid, Box } from '@mantine/core';

export default function AnalyticsLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Skeleton height={32} width={140} radius="md" />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
      <Skeleton height={280} radius="md" />
    </Container>
  );
}
