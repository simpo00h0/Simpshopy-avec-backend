'use client';

import { Container, Skeleton, Group } from '@mantine/core';

export default function OrdersLoading() {
  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Skeleton height={32} width={160} radius="md" />
        <Skeleton height={36} width={200} radius="md" />
      </Group>
      <Skeleton height={320} radius="md" />
    </Container>
  );
}
