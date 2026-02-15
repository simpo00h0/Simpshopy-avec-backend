'use client';

import { useEffect } from 'react';
import { Box, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { LEAVE_FADE_MS } from '../editor-constants';

interface LeaveConfirmPortalProps {
  hasUnsavedChanges: boolean;
  leaveSaveInProgress: boolean;
  showAsUnsaved: boolean;
  isLeaving: boolean;
  onClose: () => void;
  onLeaveWithoutSave: () => void;
  onSaveAndLeave: () => Promise<void>;
}

export function LeaveConfirmPortal({
  hasUnsavedChanges,
  leaveSaveInProgress,
  showAsUnsaved,
  isLeaving,
  onClose,
  onLeaveWithoutSave,
  onSaveAndLeave,
}: LeaveConfirmPortalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !leaveSaveInProgress) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [leaveSaveInProgress, onClose]);

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-confirm-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        opacity: isLeaving ? 0 : 1,
        transition: `opacity ${LEAVE_FADE_MS}ms ease-out`,
        pointerEvents: isLeaving ? 'none' : 'auto',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => !leaveSaveInProgress && onClose()}
        aria-hidden
      />
      <Paper
        id="leave-confirm-dialog"
        shadow="lg"
        p="md"
        radius="md"
        withBorder
        style={{
          position: 'relative',
          zIndex: 10001,
          maxWidth: 400,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title order={4} id="leave-confirm-title" mb="md">
          {showAsUnsaved ? 'Modifications non enregistrées' : 'Quitter le constructeur'}
        </Title>
        <Stack gap="md">
          {showAsUnsaved ? (
            <>
              <Text size="sm" c="dimmed">
                Si vous quittez sans enregistrer, vous perdrez vos modifications. Vous pouvez enregistrer d&apos;abord ou quitter quand même.
              </Text>
              <Group justify="flex-end" wrap="wrap" gap="xs">
                <Button variant="default" size="sm" onClick={onClose} disabled={leaveSaveInProgress}>
                  Annuler
                </Button>
                <Button variant="filled" color="red" size="sm" onClick={onLeaveWithoutSave} disabled={leaveSaveInProgress}>
                  Quitter sans enregistrer
                </Button>
                <Button variant="filled" color="green" size="sm" loading={leaveSaveInProgress} onClick={onSaveAndLeave}>
                  Enregistrer et quitter
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Voulez-vous vraiment quitter le constructeur ?
              </Text>
              <Group justify="flex-end" gap="xs">
                <Button variant="default" size="sm" onClick={onClose}>
                  Annuler
                </Button>
                <Button variant="filled" color="green" size="sm" onClick={onLeaveWithoutSave}>
                  Quitter
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
