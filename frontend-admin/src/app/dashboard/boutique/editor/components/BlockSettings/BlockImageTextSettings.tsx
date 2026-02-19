'use client';

import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockImageTextSettings({ customization, update }: BlockSettingsProps) {
  const img = customization.imageText;
  return (
    <Stack gap="sm">
      <TextInput label="URL image" placeholder="https://..." value={img?.imageUrl ?? ''} onChange={(e) => update('imageText', { ...img, imageUrl: e.target.value })} />
      <TextInput label="Titre" placeholder="Notre histoire" value={img?.title ?? ''} onChange={(e) => update('imageText', { ...img, title: e.target.value })} />
      <Textarea label="Contenu" placeholder="Texte..." rows={3} value={img?.content ?? ''} onChange={(e) => update('imageText', { ...img, content: e.target.value })} />
      <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={img?.position ?? 'left'} onChange={(v) => update('imageText', { ...img, position: (v as 'left' | 'right') ?? 'left' })} comboboxProps={{ withinPortal: true, zIndex: 10000 }} />
      <TextInput label="Texte bouton (optionnel)" value={img?.ctaText ?? ''} onChange={(e) => update('imageText', { ...img, ctaText: e.target.value })} />
      <TextInput label="Lien bouton" placeholder="/collections/all" value={img?.ctaHref ?? ''} onChange={(e) => update('imageText', { ...img, ctaHref: e.target.value })} />
    </Stack>
  );
}
