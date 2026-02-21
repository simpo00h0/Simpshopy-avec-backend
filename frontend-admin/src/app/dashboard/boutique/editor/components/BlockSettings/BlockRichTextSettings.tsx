'use client';

import { Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockRichTextSettings({ customization, updateNested }: BlockSettingsProps) {
  const richText = customization.richText ?? {};
  const upd = (k: keyof typeof richText, v: string) => updateNested('richText', k, v);
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos de nous" value={richText.heading ?? ''} onChange={(e) => upd('heading', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={richText.content ?? ''} onChange={(e) => upd('content', e.target.value)} />
    </Stack>
  );
}
