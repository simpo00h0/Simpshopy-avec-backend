'use client';

import { Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockRichTextSettings({ customization, updateNested }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos de nous" value={customization.richText?.heading ?? ''} onChange={(e) => updateNested('richText', 'heading', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.richText?.content ?? ''} onChange={(e) => updateNested('richText', 'content', e.target.value)} />
    </Stack>
  );
}
