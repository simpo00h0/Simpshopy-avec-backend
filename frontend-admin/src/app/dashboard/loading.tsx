'use client';

import { Container, Skeleton, Stack, SimpleGrid, Box } from '@mantine/core';

export default function DashboardLoading() {
  return (
    <Container size="xl" py="xl">
      <Skeleton height={36} width={320} mb="lg" />
      <Skeleton height={24} width={240} mb="xs" />
      <Stack gap="md" mb="xl">
        <Skeleton height={120} radius="md" />
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {[1, 2, 3].map((i) => (
            <Box key={i}>
              <Skeleton height={100} radius="md" />
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={100} radius="md" />
        ))}
      </SimpleGrid>
    </Container>
  );
}
