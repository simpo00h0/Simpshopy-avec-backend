'use client';

import { Container, Skeleton, Group, Box } from '@mantine/core';

export default function CustomersLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Skeleton height={32} width={100} radius="md" />
      </Group>
      <Skeleton height={300} radius="md" />
    </Container>
  );
}
