'use client';

import {
  Box,
  Button,
  Group,
  Title,
  Text,
  Divider,
  SegmentedControl,
  Select,
  Switch,
  Tooltip,
  ActionIcon,
  Badge,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconKeyboard,
  IconLayout2,
  IconSettings,
  IconEye,
  IconPlus,
} from '@tabler/icons-react';
import { TEMPLATES } from '../editor-constants';

interface EditorToolbarProps {
  className?: string;
  currentStoreName: string | null;
  onLeave: () => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  hasUnsavedChanges: boolean;
  isLeaving: boolean;
  historyIndex: number;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onShortcuts: () => void;
  onAddBlock: () => void;
  selectedBlock: string | null;
  onLibrary: () => void;
  onSettings: () => void;
  autoSaveEnabled: boolean;
  onAutoSaveChange: (v: boolean) => void;
  currentTemplateId: string;
  onTemplateChange: (v: string) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (v: 'desktop' | 'tablet' | 'mobile') => void;
  previewMode: boolean;
  onPreviewToggle: () => void;
}

export function EditorToolbar(props: EditorToolbarProps) {
  const {
    currentStoreName,
    onLeave,
    onSave,
    saving,
    saved,
    hasUnsavedChanges,
    isLeaving,
    historyIndex,
    historyLength,
    onUndo,
    onRedo,
    onShortcuts,
    onAddBlock,
    selectedBlock,
    onLibrary,
    onSettings,
    autoSaveEnabled,
    onAutoSaveChange,
    currentTemplateId,
    onTemplateChange,
    viewport,
    onViewportChange,
    previewMode,
    onPreviewToggle,
  } = props;

  return (
    <Box className={props.className} p={{ base: 'xs', md: 'sm' }}>
      <Group justify="space-between" wrap="wrap" gap="xs" mb="xs">
        <Group wrap="wrap" gap="xs" style={{ minWidth: 0, flex: 1 }}>
          <Button variant="subtle" size="xs" leftSection={<IconArrowLeft size={16} />} onClick={onLeave}>
            Quitter
          </Button>
          <Divider orientation="vertical" hiddenFrom="md" />
          <Title order={6} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
            Constructeur
          </Title>
          <Text size="xs" c="dimmed" visibleFrom="lg">
            {currentStoreName}
          </Text>
          <Tooltip label="Bibliothèque de blocs" hiddenFrom="lg">
            <ActionIcon variant="filled" color="green" size="lg" onClick={onLibrary} aria-label="Bibliothèque de blocs">
              <IconLayout2 size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Paramètres du bloc" hiddenFrom="lg">
            <ActionIcon
              variant={selectedBlock ? 'light' : 'default'}
              size="lg"
              onClick={onSettings}
              aria-label="Paramètres"
            >
              <IconSettings size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group wrap="nowrap" gap={4}>
          <Tooltip label="Annuler">
            <ActionIcon variant="subtle" size="md" onClick={onUndo} disabled={historyIndex <= 0}>
              <IconArrowBackUp size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Rétablir">
            <ActionIcon variant="subtle" size="md" onClick={onRedo} disabled={historyIndex >= historyLength - 1}>
              <IconArrowForwardUp size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Raccourcis">
            <ActionIcon variant="subtle" size="md" onClick={onShortcuts}>
              <IconKeyboard size={18} />
            </ActionIcon>
          </Tooltip>
          {hasUnsavedChanges && !isLeaving ? (
            <Tooltip label="Des modifications ne sont pas enregistrées. Cliquez sur Sauvegarder ou utilisez Ctrl+S.">
              <Badge size="sm" color="orange" variant="filled" style={{ cursor: 'help' }}>
                Non enregistré
              </Badge>
            </Tooltip>
          ) : (
            <Tooltip label="Toutes les modifications sont enregistrées.">
              <Badge size="sm" color="green" variant="light">
                Enregistré
              </Badge>
            </Tooltip>
          )}
          <Button size="xs" leftSection={<IconDeviceFloppy size={16} />} color="green" onClick={onSave} loading={saving}>
            {saved ? '✓' : 'Sauvegarder'}
          </Button>
        </Group>
      </Group>
      <Group gap="xs" wrap="wrap">
        <Switch size="xs" label="Sauvegarde auto (4 s)" checked={autoSaveEnabled} onChange={(e) => onAutoSaveChange(e.currentTarget.checked)} />
        <Select
          size="xs"
          value={currentTemplateId}
          onChange={(v) => onTemplateChange(v ?? 'home')}
          data={TEMPLATES.map((t) => ({ label: t.label, value: t.id }))}
          style={{ flex: 1, minWidth: 100 }}
          hiddenFrom="lg"
        />
        <SegmentedControl
          size="xs"
          value={currentTemplateId}
          onChange={(v) => onTemplateChange(v ?? 'home')}
          data={TEMPLATES.map((t) => ({ label: t.label, value: t.id }))}
          visibleFrom="lg"
        />
        <SegmentedControl
          size="xs"
          value={viewport}
          onChange={(v) => onViewportChange(v as 'desktop' | 'tablet' | 'mobile')}
          data={[
            { label: <IconDeviceDesktop size={14} />, value: 'desktop' },
            { label: 'T', value: 'tablet' },
            { label: <IconDeviceMobile size={14} />, value: 'mobile' },
          ]}
        />
        <Tooltip label={previewMode ? "Quitter l'aperçu" : 'Aperçu sans bordures'}>
          <ActionIcon size="md" variant={previewMode ? 'filled' : 'subtle'} color="blue" onClick={onPreviewToggle} aria-label="Aperçu">
            <IconEye size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Ajouter un bloc">
          <ActionIcon size="md" variant="subtle" color="green" onClick={onAddBlock} aria-label="Ajouter un bloc">
            <IconPlus size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
}
