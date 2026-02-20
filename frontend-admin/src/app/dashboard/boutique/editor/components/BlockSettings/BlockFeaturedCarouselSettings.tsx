'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFeaturedCarouselSettings({ customization, update }: BlockSettingsProps) {
  const fc = customization.featuredCarousel ?? {};
  return (
    <Stack gap="sm">
      <TextInput label="Titre du carousel" placeholder="Nouveautés" value={fc.title ?? ''} onChange={(e) => update('featuredCarousel', { ...fc, title: e.target.value })} />
    </Stack>
  );
}
