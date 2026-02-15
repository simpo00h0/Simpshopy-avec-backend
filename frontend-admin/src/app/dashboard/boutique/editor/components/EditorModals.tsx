'use client';

import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { HOME_BLOCKS } from '../editor-constants';
import type { BlockId } from '../editor-types';

interface ShortcutsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ opened, onClose }: ShortcutsModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Raccourcis clavier" size="sm">
      <Stack gap="sm">
        <Group justify="space-between"><Text size="sm">Enregistrer</Text><Text size="xs" c="dimmed">Ctrl + S</Text></Group>
        <Group justify="space-between"><Text size="sm">Annuler</Text><Text size="xs" c="dimmed">Ctrl + Z</Text></Group>
        <Group justify="space-between"><Text size="sm">Rétablir</Text><Text size="xs" c="dimmed">Ctrl + Shift + Z</Text></Group>
        <Group justify="space-between"><Text size="sm">Ajouter un bloc</Text><Text size="xs" c="dimmed">Ctrl + Shift + A</Text></Group>
        <Group justify="space-between"><Text size="sm">Afficher les raccourcis</Text><Text size="xs" c="dimmed">Ctrl + /</Text></Group>
      </Stack>
    </Modal>
  );
}

interface AddBlockModalProps {
  opened: boolean;
  onClose: () => void;
  onAddBlock: (blockId: BlockId) => void;
}

export function AddBlockModal({ opened, onClose, onAddBlock }: AddBlockModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ajouter un bloc" size="sm">
      <Text size="sm" c="dimmed" mb="md">
        Choisissez un bloc à ajouter à la fin de la page. Même type plusieurs fois possible.
      </Text>
      <Stack gap={4}>
        {HOME_BLOCKS.filter((b) => b.template === 'home').map((b) => (
          <Button
            key={b.id}
            variant="light"
            size="sm"
            fullWidth
            onClick={() => onAddBlock(b.id as BlockId)}
          >
            {b.label}
          </Button>
        ))}
      </Stack>
    </Modal>
  );
}
