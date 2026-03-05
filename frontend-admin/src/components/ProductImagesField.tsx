'use client';

import { useState } from 'react';
import { Box, Group, SimpleGrid, Text, Button } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconTrash, IconLibrary } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { MediaPicker } from './MediaPicker';

export interface ProductImagesFieldProps {
  images: string[];
  onRemove: (url: string) => void;
  onAdd: (url: string) => void;
  onDrop: (files: File[]) => Promise<void>;
  loading: boolean;
}

export function ProductImagesField({
  images,
  onRemove,
  onAdd,
  onDrop,
  loading,
}: ProductImagesFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Box>
      <Text size="sm" fw={500} mb={4}>
        Images du produit
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        JPEG, PNG, GIF ou WebP — max 5 Mo. Upload ou sélection depuis la bibliothèque.
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mb="sm">
        {images.map((url) => (
          <Box
            key={url}
            pos="relative"
            style={{
              aspectRatio: '1',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid var(--mantine-color-default-border)',
            }}
          >
            <Box
              component="img"
              src={url}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <ActionIcon
              size="sm"
              color="red"
              variant="filled"
              aria-label="Supprimer"
              onClick={() => onRemove(url)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
              }}
            >
              <IconTrash size={12} />
            </ActionIcon>
          </Box>
        ))}
        <Dropzone
          onDrop={onDrop}
          maxSize={5 * 1024 * 1024}
          accept={IMAGE_MIME_TYPE}
          loading={loading}
          style={{
            minHeight: 100,
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Group justify="center" gap="xs" style={{ pointerEvents: 'none' }}>
            <IconPhoto size={32} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="xs" c="dimmed">
              Upload
            </Text>
          </Group>
        </Dropzone>
      </SimpleGrid>
      <Button
        variant="light"
        size="xs"
        leftSection={<IconLibrary size={14} />}
        onClick={() => setPickerOpen(true)}
      >
        Choisir depuis la bibliothèque
      </Button>
      <MediaPicker
        opened={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          onAdd(url);
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}
