'use client';

import { NumberInput, Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockCategoriesSettings({ customization, update }: BlockSettingsProps) {
  const cat = customization.categories ?? {};
  const upd = <K extends keyof typeof cat>(k: K, v: (typeof cat)[K]) =>
    update('categories', { ...cat, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Parcourir par catégorie" value={cat.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <NumberInput label="Nombre max de catégories" placeholder="Toutes" min={1} max={12} value={cat.limit ?? undefined} onChange={(v) => upd('limit', typeof v === 'string' ? undefined : v)} />
    </Stack>
  );
}
