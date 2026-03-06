'use client';

import { useState } from 'react';
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconPhoto, IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { MediaPicker } from './MediaPicker';

export interface ProductImagesFieldProps {
  images: string[];
  onRemove: (url: string) => void;
  onAdd: (url: string) => void;
  onAddMultiple?: (urls: string[]) => void;
  onReorder?: (urls: string[]) => void;
}

export function ProductImagesField({
  images,
  onRemove,
  onAdd,
  onAddMultiple,
  onReorder,
}: ProductImagesFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Box style={{ maxWidth: 320 }}>
      <Text size="sm" fw={500} mb={4}>
        Images du produit
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        La première image est mise en avant (cartes, listes). Utilisez les flèches pour réordonner.
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="xs">
        {images.map((url, index) => {
          const canMoveUp = onReorder && index > 0;
          const canMoveDown = onReorder && index < images.length - 1;
          const moveUp = () => {
            if (!onReorder || !canMoveUp) return;
            const next = [...images];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            onReorder(next);
          };
          const moveDown = () => {
            if (!onReorder || !canMoveDown) return;
            const next = [...images];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            onReorder(next);
          };
          return (
            <Box
              key={url}
              pos="relative"
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                overflow: 'hidden',
                border: `1px solid ${index === 0 ? 'var(--mantine-color-green-5)' : 'var(--mantine-color-default-border)'}`,
                boxShadow: index === 0 ? '0 0 0 2px var(--mantine-color-green-3)' : undefined,
              }}
            >
              {index === 0 && (
                <Text
                  size="xs"
                  fw={600}
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    zIndex: 1,
                    backgroundColor: 'var(--mantine-color-green-6)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  Mise en avant
                </Text>
              )}
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
              <Group gap={4} style={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }}>
                {canMoveUp && (
                  <ActionIcon size="xs" variant="filled" aria-label="Monter" onClick={moveUp}>
                    <IconArrowUp size={10} />
                  </ActionIcon>
                )}
                {canMoveDown && (
                  <ActionIcon size="xs" variant="filled" aria-label="Descendre" onClick={moveDown}>
                    <IconArrowDown size={10} />
                  </ActionIcon>
                )}
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="filled"
                  aria-label="Supprimer"
                  onClick={() => onRemove(url)}
                >
                  <IconTrash size={10} />
                </ActionIcon>
              </Group>
            </Box>
          );
        })}
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
          <Stack align="center" gap={2}>
            <IconPhoto size={24} color="var(--mantine-color-dimmed)" stroke={1.5} />
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
