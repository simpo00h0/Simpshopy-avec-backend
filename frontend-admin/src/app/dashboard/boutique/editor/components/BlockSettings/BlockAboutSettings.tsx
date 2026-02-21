'use client';

import { Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockAboutSettings({ customization, updateNested }: BlockSettingsProps) {
  const about = customization.about ?? {};
  const upd = (k: keyof typeof about, v: string) => updateNested('about', k, v);
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos" value={about.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={about.content ?? ''} onChange={(e) => upd('content', e.target.value)} />
    </Stack>
  );
}
