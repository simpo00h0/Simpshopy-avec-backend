'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockPromoBannerSettings({ customization, update }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="Message promo" placeholder="Livraison gratuite dès 25 000 XOF" value={customization.promoBanner ?? ''} onChange={(e) => update('promoBanner', e.target.value)} />
    </Stack>
  );
}
