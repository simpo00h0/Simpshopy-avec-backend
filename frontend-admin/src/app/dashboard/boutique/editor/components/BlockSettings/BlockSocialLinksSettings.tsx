'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockSocialLinksSettings({ customization, update }: BlockSettingsProps) {
  const links = customization.socialLinks ?? {};
  const upd = <K extends keyof typeof links>(k: K, v: (typeof links)[K]) =>
    update('socialLinks', { ...links, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="Facebook (URL)" placeholder="https://facebook.com/..." value={links.facebook ?? ''} onChange={(e) => upd('facebook', e.target.value)} />
      <TextInput label="Instagram (URL)" placeholder="https://instagram.com/..." value={links.instagram ?? ''} onChange={(e) => upd('instagram', e.target.value)} />
      <TextInput label="WhatsApp (URL ou numéro)" placeholder="+221771234567" value={links.whatsapp ?? ''} onChange={(e) => upd('whatsapp', e.target.value)} />
      <TextInput label="Twitter / X (URL)" placeholder="https://twitter.com/..." value={links.twitter ?? ''} onChange={(e) => upd('twitter', e.target.value)} />
    </Stack>
  );
}
