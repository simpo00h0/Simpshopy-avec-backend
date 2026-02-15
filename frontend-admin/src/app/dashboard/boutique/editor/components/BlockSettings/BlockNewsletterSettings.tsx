'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockNewsletterSettings({ customization, update }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Restez informé" value={customization.newsletterTitle ?? ''} onChange={(e) => update('newsletterTitle', e.target.value)} />
    </Stack>
  );
}
