'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockVideoSettings({ customization, update }: BlockSettingsProps) {
  const vid = customization.video ?? {};
  const upd = <K extends keyof typeof vid>(k: K, v: (typeof vid)[K]) =>
    update('video', { ...vid, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="URL vidéo" placeholder="https://youtube.com/... ou https://vimeo.com/..." value={vid.url ?? ''} onChange={(e) => upd('url', e.target.value)} />
      <TextInput label="Titre (optionnel)" placeholder="Notre vidéo" value={vid.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
    </Stack>
  );
}
