'use client';

import { Container, Skeleton, Group, SimpleGrid, Box } from '@mantine/core';

export default function ThemesLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl" gap="xs">
        <Skeleton height={32} width={200} radius="md" />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} height={180} radius="md" />
        ))}
      </SimpleGrid>
    </Container>
  );
}
