'use client';

import { NumberInput, Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFeaturedProductsSettings({ customization, update }: BlockSettingsProps) {
  const fp = customization.featuredProducts ?? {};
  const upd = <K extends keyof typeof fp>(k: K, v: (typeof fp)[K]) =>
    update('featuredProducts', { ...fp, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Tous nos produits" value={fp.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <NumberInput label="Nombre de produits" placeholder="6" min={2} max={24} value={fp.limit ?? 6} onChange={(v) => upd('limit', typeof v === 'string' ? parseInt(String(v), 10) || 6 : v)} />
    </Stack>
  );
}
