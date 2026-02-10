'use client';

import { Container, Skeleton, Group, Stack, Box } from '@mantine/core';

export default function SettingsLoading() {
  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Skeleton height={32} width={140} radius="md" />
      </Group>
      <Stack gap="md">
        <Skeleton height={80} radius="md" />
        <Skeleton height={80} radius="md" />
        <Skeleton height={120} radius="md" />
      </Stack>
    </Container>
  );
}
