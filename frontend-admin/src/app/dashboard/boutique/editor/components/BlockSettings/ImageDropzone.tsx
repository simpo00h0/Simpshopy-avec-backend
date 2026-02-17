'use client';

import { useState } from 'react';
import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconTrash } from '@tabler/icons-react';

export const LOGO_FAVICON_MIME = [...IMAGE_MIME_TYPE, 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];

export interface ImageDropzoneProps {
  imageUrl: string;
  onDrop: (files: File[]) => Promise<void>;
  onRemove: () => void;
  loading: boolean;
  placeholder: string;
  imageStyle: React.CSSProperties;
  maxSize: number;
  accept?: string[];
}

export function ImageDropzone({
  imageUrl,
  onDrop,
  onRemove,
  loading,
  placeholder,
  imageStyle,
  maxSize,
  accept = IMAGE_MIME_TYPE,
}: ImageDropzoneProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <Dropzone
      onDrop={onDrop}
      maxSize={maxSize}
      accept={accept}
      loading={loading}
      maxFiles={1}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        style={{
          position: 'relative',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {imageUrl ? (
          <Box component="img" src={imageUrl} alt="" style={imageStyle} />
        ) : (
          <Group justify="center" gap="xl">
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="sm" inline>
              {placeholder}
            </Text>
          </Group>
        )}
        {imageUrl && hovered && (
          <ActionIcon
            size="sm"
            color="red"
            variant="filled"
            aria-label="Supprimer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              pointerEvents: 'auto',
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        )}
      </Box>
    </Dropzone>
  );
}
