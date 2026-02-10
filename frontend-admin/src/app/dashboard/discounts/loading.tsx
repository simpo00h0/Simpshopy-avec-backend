'use client';

import { Container, Skeleton, Group, Box } from '@mantine/core';

export default function DiscountsLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Skeleton height={32} width={120} radius="md" />
      </Group>
      <Skeleton height={240} radius="md" />
    </Container>
  );
}
