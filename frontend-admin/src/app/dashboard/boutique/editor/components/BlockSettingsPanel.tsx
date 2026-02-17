'use client';

import { ActionIcon, Box, Button, Group, Paper, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { ThemeCustomization } from '@simpshopy/shared';
import { HOME_BLOCKS } from '../editor-constants';
import type { BlockId } from '../editor-types';
import type { BlockSettingsProps } from '../editor-types';
import { BlockSettings } from './BlockSettings';

interface BlockSettingsPanelProps extends BlockSettingsProps {
  selectedBlock: string | null;
  updateBlockData?: (instanceId: string, data: Record<string, unknown>) => void;
  updateBlockNested?: (instanceId: string, subKey: string, value: string | number) => void;
  blocks?: Record<string, { type: string; data: Record<string, unknown> }>;
  onClose: () => void;
  onDeselect: () => void;
  className?: string;
  panelCloseClassName?: string;
}

function isInstanceId(id: string): boolean {
  return id.startsWith('b-');
}

function buildBlockAdapter(
  instanceId: string,
  blockType: string,
  blockData: Record<string, unknown>,
  updateBlockData: (id: string, data: Record<string, unknown>) => void,
  updateBlockNested: (id: string, subKey: string, value: string | number) => void
): { customization: ThemeCustomization; update: BlockSettingsProps['update']; updateNested: BlockSettingsProps['updateNested'] } {
  const customization: ThemeCustomization = {
    hero: blockType === 'hero' ? (blockData as ThemeCustomization['hero']) : undefined,
    promoBanner: blockType === 'promoBanner' ? (blockData.text as string) : undefined,
    richText: blockType === 'richText' ? (blockData as ThemeCustomization['richText']) : undefined,
    categories: blockType === 'categories' ? (blockData as ThemeCustomization['categories']) : undefined,
    featuredCarousel: blockType === 'featuredCarousel' ? (blockData as ThemeCustomization['featuredCarousel']) : undefined,
    featuredProducts: blockType === 'featuredProducts' ? (blockData as ThemeCustomization['featuredProducts']) : undefined,
    countdown: blockType === 'countdown' ? (blockData as ThemeCustomization['countdown']) : undefined,
    video: blockType === 'video' ? (blockData as ThemeCustomization['video']) : undefined,
    imageText: blockType === 'imageText' ? (blockData as ThemeCustomization['imageText']) : undefined,
    separator: blockType === 'separator' ? (blockData as ThemeCustomization['separator']) : undefined,
    ctaButtons: blockType === 'ctaButtons' ? (blockData as ThemeCustomization['ctaButtons']) : undefined,
    testimonials: blockType === 'testimonials' ? (blockData as ThemeCustomization['testimonials']) : undefined,
    faq: blockType === 'faq' ? (blockData as ThemeCustomization['faq']) : undefined,
    socialLinks: blockType === 'socialLinks' ? (blockData as ThemeCustomization['socialLinks']) : undefined,
    trustBadges: blockType === 'trustBadges' ? (blockData as ThemeCustomization['trustBadges']) : undefined,
    newsletterTitle: blockType === 'newsletter' ? (blockData.title as string) : undefined,
    heroAlignment: (blockData.heroAlignment as ThemeCustomization['heroAlignment']) ?? undefined,
    heroHeight: (blockData.heroHeight as ThemeCustomization['heroHeight']) ?? undefined,
    logo: blockType === 'logo' ? (blockData.logoUrl as string) : undefined,
    favicon: blockType === 'logo' ? (blockData.faviconUrl as string) : undefined,
    logoAlignment: blockType === 'logo' ? (blockData.logoAlignment as 'left' | 'center' | 'right') : undefined,
  } as ThemeCustomization;
  const update: BlockSettingsProps['update'] = (key, value) => {
    if (blockType === 'logo') {
      const map: Record<string, string> = { logo: 'logoUrl', favicon: 'faviconUrl', logoAlignment: 'logoAlignment' };
      const dataKey = map[key] ?? key;
      updateBlockData(instanceId, { [dataKey]: value });
    } else if (key === 'promoBanner' && typeof value === 'string') {
      updateBlockData(instanceId, { text: value });
    } else if (key === 'newsletterTitle' && typeof value === 'string') {
      updateBlockData(instanceId, { title: value });
    } else if (typeof value === 'object' && value !== null) {
      updateBlockData(instanceId, value as Record<string, unknown>);
    } else {
      updateBlockData(instanceId, { [key]: value });
    }
  };
  const updateNested: BlockSettingsProps['updateNested'] = (_key, subKey, value) => {
    updateBlockNested(instanceId, subKey, value);
  };
  return { customization, update, updateNested };
}

export function BlockSettingsPanel({
  selectedBlock,
  customization,
  update,
  updateNested,
  updateBlockData,
  updateBlockNested,
  blocks = {},
  onClose,
  onDeselect,
  className,
  panelCloseClassName,
}: BlockSettingsPanelProps) {
  const blockLabel = isInstanceId(selectedBlock ?? '')
    ? HOME_BLOCKS.find((b) => b.id === blocks[selectedBlock!]?.type)?.label
    : HOME_BLOCKS.find((b) => b.id === selectedBlock)?.label;

  const isInstance = selectedBlock && isInstanceId(selectedBlock);
  const block = isInstance ? blocks[selectedBlock] : null;
  const effectiveProps: BlockSettingsProps | null = isInstance && block && updateBlockData && updateBlockNested
    ? buildBlockAdapter(selectedBlock, block.type, block.data, updateBlockData, updateBlockNested)
    : { customization, update, updateNested };

  const settingsBlockId: BlockId = isInstance && block ? (block.type as BlockId) : (selectedBlock as BlockId);

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
            <BlockSettings
                selectedBlock={settingsBlockId}
                customization={effectiveProps.customization}
                update={effectiveProps.update}
                updateNested={effectiveProps.updateNested}
              />
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
