'use client';

import { Box } from '@mantine/core';
import { Loader } from '@/components/Loader';

export default function DashboardLoading() {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100dvh - 60px)',
        width: '100%',
      }}
    >
      <Loader size={28} />
    </Box>
  );
}
