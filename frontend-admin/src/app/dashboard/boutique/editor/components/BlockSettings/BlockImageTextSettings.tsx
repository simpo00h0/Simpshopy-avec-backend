'use client';

import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockImageTextSettings({ customization, update }: BlockSettingsProps) {
  const img = customization.imageText ?? {};
  const upd = (k: keyof typeof img, v: unknown) => update('imageText', { ...img, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="URL image" placeholder="https://..." value={img.imageUrl ?? ''} onChange={(e) => upd('imageUrl', e.target.value)} />
      <TextInput label="Titre" placeholder="Notre histoire" value={img.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Texte..." rows={3} value={img.content ?? ''} onChange={(e) => upd('content', e.target.value)} />
      <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={img.position ?? 'left'} onChange={(v) => upd('position', (v as 'left' | 'right') ?? 'left')} comboboxProps={{ withinPortal: true, zIndex: 10000 }} />
      <TextInput label="Texte bouton (optionnel)" value={img.ctaText ?? ''} onChange={(e) => upd('ctaText', e.target.value)} />
      <TextInput label="Lien bouton" placeholder="/collections/all" value={img.ctaHref ?? ''} onChange={(e) => upd('ctaHref', e.target.value)} />
    </Stack>
  );
}
