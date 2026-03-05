'use client';

import { useState } from 'react';
import { Box, SimpleGrid, Text, Button } from '@mantine/core';
import { IconLibrary, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { MediaPicker } from './MediaPicker';

export interface ProductImagesFieldProps {
  images: string[];
  onRemove: (url: string) => void;
  onAdd: (url: string) => void;
}

export function ProductImagesField({
  images,
  onRemove,
  onAdd,
}: ProductImagesFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Box>
      <Text size="sm" fw={500} mb={4}>
        Images du produit
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        Sélectionnez les images depuis la bibliothèque.
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
