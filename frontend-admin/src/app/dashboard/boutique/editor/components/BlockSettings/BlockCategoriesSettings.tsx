'use client';

import { NumberInput, Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockCategoriesSettings({ customization, update }: BlockSettingsProps) {
  const cat = customization.categories;
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Parcourir par catégorie" value={cat?.title ?? ''} onChange={(e) => update('categories', { ...cat, title: e.target.value })} />
      <NumberInput label="Nombre max de catégories" placeholder="Toutes" min={1} max={12} value={cat?.limit ?? undefined} onChange={(v) => update('categories', { ...cat, limit: typeof v === 'string' ? undefined : v })} />
    </Stack>
  );
}
