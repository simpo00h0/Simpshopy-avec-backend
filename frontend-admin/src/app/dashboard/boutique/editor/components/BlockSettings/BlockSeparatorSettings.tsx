'use client';

import { NumberInput, Select, Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockSeparatorSettings({ customization, update }: BlockSettingsProps) {
  const sep = customization.separator ?? {};
  const upd = (k: keyof typeof sep, v: unknown) => update('separator', { ...sep, [k]: v });
  return (
    <Stack gap="sm">
      <Select label="Style" data={[{ value: 'line', label: 'Ligne' }, { value: 'dashed', label: 'Tirets' }, { value: 'dotted', label: 'Pointillé' }, { value: 'space', label: 'Espace' }]} value={sep.style ?? 'line'} onChange={(v) => upd('style', (v as 'line' | 'space' | 'dotted' | 'dashed') ?? 'line')} comboboxProps={{ withinPortal: true, zIndex: 10000 }} />
      <NumberInput label="Épaisseur (px)" min={1} max={100} value={sep.thickness ?? 2} onChange={(v) => upd('thickness', typeof v === 'string' ? 2 : v)} />
      <TextInput label="Couleur (optionnel)" placeholder="#ccc" value={sep.color ?? ''} onChange={(e) => upd('color', e.target.value)} />
    </Stack>
  );
}
