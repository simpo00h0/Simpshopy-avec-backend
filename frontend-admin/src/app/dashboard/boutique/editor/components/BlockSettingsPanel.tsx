'use client';

import { ActionIcon, Box, Button, Group, Paper, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { HOME_BLOCKS } from '../editor-constants';
import type { BlockId } from '../editor-types';
import type { BlockSettingsProps } from '../editor-types';
import { BlockSettings } from './BlockSettings';

interface BlockSettingsPanelProps extends BlockSettingsProps {
  selectedBlock: BlockId | null;
  onClose: () => void;
  onDeselect: () => void;
  className?: string;
  panelCloseClassName?: string;
}

export function BlockSettingsPanel({
  selectedBlock,
  customization,
  update,
  updateNested,
  onClose,
  onDeselect,
  className,
  panelCloseClassName,
}: BlockSettingsPanelProps) {
  const blockLabel = HOME_BLOCKS.find((b) => b.id === selectedBlock)?.label;

  return (
    <Paper
      className={className}
      p="md"
      radius={0}
      style={{
        minHeight: 0,
        borderLeft: '1px solid var(--mantine-color-gray-2)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {selectedBlock ? (
        <>
          <Group justify="space-between" mb="sm" wrap="nowrap">
            <Text size="sm" fw={600}>
              Paramètres du bloc
            </Text>
            <ActionIcon variant="subtle" size="sm" onClick={onClose} className={panelCloseClassName} aria-label="Fermer">
              <IconX size={18} />
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mb="md">
            Modifier : {blockLabel}
          </Text>
          <Box style={{ flex: '1 1 0', minHeight: 0, overflowY: 'scroll', overflowX: 'hidden', scrollbarGutter: 'stable' }}>
            <BlockSettings selectedBlock={selectedBlock} customization={customization} update={update} updateNested={updateNested} />
          </Box>
          <Button size="xs" variant="subtle" mt="md" fullWidth onClick={onDeselect}>
            Désélectionner
          </Button>
        </>
      ) : (
        <Text size="sm" c="dimmed" mt="xl">
          Cliquez sur un bloc à gauche pour le modifier.
        </Text>
      )}
    </Paper>
  );
}
