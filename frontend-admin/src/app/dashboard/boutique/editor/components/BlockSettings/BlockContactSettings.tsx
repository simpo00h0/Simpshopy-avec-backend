'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockContactSettings({ customization, updateNested }: BlockSettingsProps) {
  const contact = customization.contact ?? {};
  const upd = (k: keyof typeof contact, v: string) => updateNested('contact', k, v);
  return (
    <Stack gap="sm">
      <TextInput label="Email" placeholder="contact@..." value={contact.email ?? ''} onChange={(e) => upd('email', e.target.value)} />
      <TextInput label="Téléphone" placeholder="+221..." value={contact.phone ?? ''} onChange={(e) => upd('phone', e.target.value)} />
    </Stack>
  );
}
