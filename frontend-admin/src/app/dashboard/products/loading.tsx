'use client';

import { Container, Skeleton, Group, Box } from '@mantine/core';

export default function ProductsLoading() {
  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Skeleton height={32} width={120} radius="md" />
        <Skeleton height={36} width={140} radius="md" />
      </Group>
      <Skeleton height={360} radius="md" />
    </Container>
  );
}
