'use client';

import { Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockAboutSettings({ customization, updateNested }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos" value={customization.about?.title ?? ''} onChange={(e) => updateNested('about', 'title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.about?.content ?? ''} onChange={(e) => updateNested('about', 'content', e.target.value)} />
    </Stack>
  );
}
