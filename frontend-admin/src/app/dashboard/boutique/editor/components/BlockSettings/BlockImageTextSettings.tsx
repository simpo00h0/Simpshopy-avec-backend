'use client';

import { Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { ImageLibraryPicker } from '@/components/ImageLibraryPicker';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockImageTextSettings({ customization, update }: BlockSettingsProps) {
  const img = customization.imageText ?? {};
  const upd = <K extends keyof typeof img>(k: K, v: (typeof img)[K]) =>
    update('imageText', { ...img, [k]: v });
  return (
    <Stack gap="sm">
      <Text size="sm" fw={500}>Image</Text>
      <Text size="xs" c="dimmed" mb={4}>Sélectionnez une image depuis la bibliothèque.</Text>
      <ImageLibraryPicker
        imageUrl={img.imageUrl ?? ''}
        onSelect={(url) => upd('imageUrl', url)}
        onRemove={() => upd('imageUrl', '')}
        placeholder="Cliquez pour choisir une image"
        imageStyle={{ maxWidth: 280, maxHeight: 120, objectFit: 'contain' }}
      />
      <TextInput label="Titre" placeholder="Notre histoire" value={img.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Texte..." rows={3} value={img.content ?? ''} onChange={(e) => upd('content', e.target.value)} />
      <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={img.position ?? 'left'} onChange={(v) => upd('position', (v as 'left' | 'right') ?? 'left')} comboboxProps={{ withinPortal: true, zIndex: 10000 }} />
      <TextInput label="Texte bouton (optionnel)" value={img.ctaText ?? ''} onChange={(e) => upd('ctaText', e.target.value)} />
      <TextInput label="Lien bouton" placeholder="/collections/all" value={img.ctaHref ?? ''} onChange={(e) => upd('ctaHref', e.target.value)} />
    </Stack>
  );
}
