'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockSocialLinksSettings({ customization, update }: BlockSettingsProps) {
  const links = customization.socialLinks;
  return (
    <Stack gap="sm">
      <TextInput label="Facebook (URL)" placeholder="https://facebook.com/..." value={links?.facebook ?? ''} onChange={(e) => update('socialLinks', { ...links, facebook: e.target.value })} />
      <TextInput label="Instagram (URL)" placeholder="https://instagram.com/..." value={links?.instagram ?? ''} onChange={(e) => update('socialLinks', { ...links, instagram: e.target.value })} />
      <TextInput label="WhatsApp (URL ou numéro)" placeholder="+221771234567" value={links?.whatsapp ?? ''} onChange={(e) => update('socialLinks', { ...links, whatsapp: e.target.value })} />
      <TextInput label="Twitter / X (URL)" placeholder="https://twitter.com/..." value={links?.twitter ?? ''} onChange={(e) => update('socialLinks', { ...links, twitter: e.target.value })} />
    </Stack>
  );
}
