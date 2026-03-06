'use client';

import { Box, Skeleton, SimpleGrid, Stack, Table } from '@mantine/core';

export function PageSkeleton() {
  return (
    <Box p="md" style={{ minHeight: 'calc(100dvh - 60px)' }}>
      <Stack gap="md">
        <Skeleton height={32} width="40%" radius="sm" />
        <Skeleton height={120} radius="sm" />
        <Skeleton height={200} radius="sm" />
      </Stack>
    </Box>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th><Skeleton height={20} width={80} /></Table.Th>
          <Table.Th><Skeleton height={20} width={60} /></Table.Th>
          <Table.Th><Skeleton height={20} width={60} /></Table.Th>
          <Table.Th><Skeleton height={20} width={60} /></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <Table.Tr key={i}>
            <Table.Td><Skeleton height={18} width="80%" /></Table.Td>
            <Table.Td><Skeleton height={18} width="60%" /></Table.Td>
            <Table.Td><Skeleton height={18} width="50%" /></Table.Td>
            <Table.Td><Skeleton height={18} width="40%" /></Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export function MediaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={140} radius="md" style={{ aspectRatio: '1' }} />
      ))}
    </SimpleGrid>
  );
}
