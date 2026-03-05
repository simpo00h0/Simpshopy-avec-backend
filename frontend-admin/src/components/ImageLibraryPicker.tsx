'use client';

import { useState } from 'react';
import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import { MediaPicker } from './MediaPicker';

export interface ImageLibraryPickerProps {
  imageUrl: string;
  onSelect: (url: string) => void;
  onRemove: () => void;
  placeholder: string;
  imageStyle?: React.CSSProperties;
}

export function ImageLibraryPicker({
  imageUrl,
  onSelect,
  onRemove,
  placeholder,
  imageStyle = { maxWidth: 280, maxHeight: 120, objectFit: 'contain' },
}: ImageLibraryPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Box>
      <Box
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => e.key === 'Enter' && setPickerOpen(true)}
        style={{
          position: 'relative',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '2px dashed var(--mantine-color-default-border)',
          cursor: 'pointer',
          padding: 24,
          backgroundColor: hovered ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-gray-0)',
          transition: 'border-color 0.15s, background-color 0.15s',
          borderColor: hovered ? 'var(--mantine-color-blue-4)' : undefined,
        }}
        onClick={() => setPickerOpen(true)}
      >
        {imageUrl ? (
          <>
            <Box component="img" src={imageUrl} alt="" style={imageStyle} />
            {hovered && (
              <ActionIcon
                size="sm"
                color="red"
                variant="filled"
                aria-label="Supprimer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <IconTrash size={14} />
              </ActionIcon>
            )}
          </>
        ) : (
          <Stack align="center" gap="xs">
            <IconPhoto size={48} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="sm" c="dimmed" ta="center">
              {placeholder}
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              Cliquez pour ouvrir la bibliothèque
            </Text>
          </Stack>
        )}
      </Box>
      <MediaPicker
        opened={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          onSelect(url);
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}
