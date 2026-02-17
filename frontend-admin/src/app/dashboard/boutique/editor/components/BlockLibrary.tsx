'use client';

import { ActionIcon, Box, Button, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { IconGripVertical, IconRefresh, IconX } from '@tabler/icons-react';
import { HOME_PALETTE } from '../editor-constants';
import type { BlockId } from '../editor-types';

interface BlockLibraryProps {
  blockSearch: string;
  onBlockSearchChange: (v: string) => void;
  draggedId: string | null;
  onSelectBlock: (id: BlockId) => void;
  onLibraryDragStart: (e: React.DragEvent, blockId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onResetOrder: () => void;
  onClose: () => void;
  className?: string;
  panelCloseClassName?: string;
}

export function BlockLibrary(props: BlockLibraryProps) {
  const {
    blockSearch,
    onBlockSearchChange,
    draggedId,
    onSelectBlock,
    onLibraryDragStart,
    onDragEnd,
    onResetOrder,
    onClose,
    className,
    panelCloseClassName,
  } = props;

  const filteredBlocks = HOME_PALETTE.filter(
    (b) => !blockSearch || b.label.toLowerCase().includes(blockSearch.toLowerCase())
  );

  return (
    <Paper className={className} p="md" radius={0} style={{ minHeight: 0, borderRight: '1px solid var(--mantine-color-gray-2)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Group justify="space-between" mb="sm" wrap="nowrap">
        <Text size="sm" fw={600} style={{ minWidth: 0 }}>
          Bibliothèque
        </Text>
        <ActionIcon variant="subtle" size="sm" onClick={onClose} className={panelCloseClassName} aria-label="Fermer">
          <IconX size={18} />
        </ActionIcon>
      </Group>
      <TextInput
        size="xs"
        placeholder="Rechercher..."
        value={blockSearch}
        onChange={(e) => onBlockSearchChange(e.target.value)}
        mb="sm"
        styles={{ input: { minWidth: 0 } }}
      />
      <Text size="xs" c="dimmed" mb="sm">
        Glissez un bloc sur le canvas pour l&apos;ajouter. Même type plusieurs fois possible.
      </Text>
      <Box style={{ flex: '1 1 0', minHeight: 0, overflowY: 'scroll', overflowX: 'hidden', scrollbarGutter: 'stable' }}>
        <Stack gap={4}>
          {filteredBlocks.map((b) => (
            <Paper
              key={b.id}
              p="xs"
              radius="sm"
              style={{
                cursor: b.id === 'logo' ? 'pointer' : 'grab',
                border: '1px solid var(--mantine-color-gray-2)',
                backgroundColor: draggedId === b.id ? 'var(--mantine-color-gray-1)' : undefined,
                opacity: draggedId === b.id ? 0.7 : 1,
              }}
              onClick={() => onSelectBlock(b.id as BlockId)}
              draggable={b.id !== 'logo'}
              onDragStart={b.id === 'logo' ? undefined : (e) => onLibraryDragStart(e, b.id)}
              onDragEnd={b.id === 'logo' ? undefined : onDragEnd}
            >
              <Group gap="xs" wrap="nowrap">
                {b.id !== 'logo' && <IconGripVertical size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />}
                <Text size="sm" style={{ flex: 1 }} truncate>
                  {b.label}
                </Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Box>
      <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />} mt="md" onClick={onResetOrder}>
        Réinitialiser l&apos;ordre
      </Button>
    </Paper>
  );
}
