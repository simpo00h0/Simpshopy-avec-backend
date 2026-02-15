'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockContactSettings({ customization, updateNested }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="Email" placeholder="contact@..." value={customization.contact?.email ?? ''} onChange={(e) => updateNested('contact', 'email', e.target.value)} />
      <TextInput label="Téléphone" placeholder="+221..." value={customization.contact?.phone ?? ''} onChange={(e) => updateNested('contact', 'phone', e.target.value)} />
    </Stack>
  );
}
