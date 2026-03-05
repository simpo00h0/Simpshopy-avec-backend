'use client';

import { useState } from 'react';
import { ActionIcon, Box, Button, Group, Text } from '@mantine/core';
import { IconLibrary, IconPhoto, IconTrash } from '@tabler/icons-react';
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '1px dashed var(--mantine-color-default-border)',
          cursor: 'pointer',
          padding: 16,
        }}
        onClick={() => setPickerOpen(true)}
      >
        {imageUrl ? (
          <Box component="img" src={imageUrl} alt="" style={imageStyle} />
        ) : (
          <Group justify="center" gap="xl">
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="sm" inline c="dimmed">
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
              onRemove();
            }}
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        )}
      </Box>
      <Button
        variant="light"
        size="xs"
        leftSection={<IconLibrary size={14} />}
        onClick={() => setPickerOpen(true)}
        mt="xs"
      >
        Choisir depuis la bibliothèque
      </Button>
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
