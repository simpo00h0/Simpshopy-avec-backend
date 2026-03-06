'use client';

import { Box } from '@mantine/core';
import { IconCloudUpload } from '@tabler/icons-react';

interface UploadProgressOverlayProps {
  progress: number;
}

export function UploadProgressOverlay({ progress }: UploadProgressOverlayProps) {
  return (
    <Box
      pos="absolute"
      inset={0}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        padding: 10,
      }}
    >
      <Box>
        <Box
          pos="relative"
          style={{
            height: 12,
            borderRadius: 6,
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress}%`,
              backgroundColor: 'var(--mantine-color-blue-5)',
              borderRadius: 6,
              transition: 'width 0.2s ease',
            }}
          />
          <Box
            pos="absolute"
            style={{
              left: `clamp(0px, ${progress}% - 10px, calc(100% - 20px))`,
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'left 0.2s ease',
              zIndex: 1,
            }}
          >
            <IconCloudUpload size={20} color="var(--mantine-color-blue-5)" stroke={2.5} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
