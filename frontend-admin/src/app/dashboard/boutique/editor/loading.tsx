'use client';

import { Box, Skeleton, Group } from '@mantine/core';

export default function EditorLoading() {
  return (
    <Box p={0} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Group p="sm" gap="xs" wrap="wrap">
        <Skeleton height={32} width={80} />
        <Skeleton height={24} width={120} />
        <Skeleton height={32} width={200} />
      </Group>
      <Box style={{ flex: 1, minHeight: 300 }} p="md">
        <Skeleton height="100%" radius="md" />
      </Box>
    </Box>
  );
}
