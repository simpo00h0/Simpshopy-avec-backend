'use client';

import { Box, Skeleton, Stack } from '@mantine/core';

export function StorefrontSkeleton() {
  return (
    <Box p="md">
      <Stack gap="md">
        <Skeleton height={48} width="60%" radius="sm" />
        <Skeleton height={120} radius="sm" />
        <Skeleton height={200} radius="sm" />
      </Stack>
    </Box>
  );
}
