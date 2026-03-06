'use client';

import { useState } from 'react';
import { Box, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { MediaPicker } from './MediaPicker';

export interface ProductImagesFieldProps {
  images: string[];
  onRemove: (url: string) => void;
  onAdd: (url: string) => void;
  onAddMultiple?: (urls: string[]) => void;
}

export function ProductImagesField({
  images,
  onRemove,
  onAdd,
  onAddMultiple,
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
        <Box
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setPickerOpen(true)}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setPickerOpen(true);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen(true);
          }}
          style={{
            touchAction: 'manipulation',
            aspectRatio: '1',
            borderRadius: 8,
            border: '2px dashed var(--mantine-color-default-border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mantine-color-gray-0)',
            transition: 'border-color 0.15s, background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--mantine-color-blue-4)';
            e.currentTarget.style.backgroundColor = 'var(--mantine-color-blue-0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--mantine-color-default-border)';
            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
          }}
        >
          <Stack align="center" gap={4}>
            <IconPhoto size={32} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="xs" c="dimmed" ta="center">
              Ajouter une image
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>
      <MediaPicker
        opened={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="multiple"
        onSelectMultiple={(urls) => {
          if (onAddMultiple) {
            onAddMultiple(urls);
          } else {
            urls.forEach((url) => onAdd(url));
          }
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}
