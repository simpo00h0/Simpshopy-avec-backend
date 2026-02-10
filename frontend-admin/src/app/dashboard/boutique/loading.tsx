'use client';

import { Container, Skeleton, Group, Box } from '@mantine/core';

export default function BoutiqueLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl" gap="xs">
        <Skeleton height={32} width={120} radius="md" />
      </Group>
      <Skeleton height={200} radius="md" />
      <Box mt="md">
        <Skeleton height={120} radius="md" />
      </Box>
    </Container>
  );
}
