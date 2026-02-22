'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFeaturedCarouselSettings({ customization, update }: BlockSettingsProps) {
  const fc = customization.featuredCarousel ?? {};
  const upd = <K extends keyof typeof fc>(k: K, v: (typeof fc)[K]) =>
    update('featuredCarousel', { ...fc, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="Titre du carousel" placeholder="Nouveautés" value={fc.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
    </Stack>
  );
}
