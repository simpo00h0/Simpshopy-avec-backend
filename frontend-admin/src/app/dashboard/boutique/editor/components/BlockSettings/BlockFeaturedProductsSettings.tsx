'use client';

import { NumberInput, Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFeaturedProductsSettings({ customization, update }: BlockSettingsProps) {
  const fp = customization.featuredProducts;
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Tous nos produits" value={fp?.title ?? ''} onChange={(e) => update('featuredProducts', { ...fp, title: e.target.value })} />
      <NumberInput label="Nombre de produits" placeholder="6" min={2} max={24} value={fp?.limit ?? 6} onChange={(v) => update('featuredProducts', { ...fp, limit: typeof v === 'string' ? parseInt(v, 10) || 6 : v })} />
    </Stack>
  );
}
