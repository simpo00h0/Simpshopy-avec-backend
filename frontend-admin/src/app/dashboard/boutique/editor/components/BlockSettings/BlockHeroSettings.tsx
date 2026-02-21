'use client';

import { Select, Stack, Text, TextInput } from '@mantine/core';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import type { BlockSettingsProps } from '../../editor-types';
import { ImageDropzone } from './ImageDropzone';

export function BlockHeroSettings({ customization, update, updateNested }: BlockSettingsProps) {
  const hero = customization.hero ?? {};
  const upd = (k: keyof typeof hero, v: string) => updateNested('hero', k, v);
  const { handleDrop, loading } = useImageUpload({
    onUpdate: (url) => updateNested('hero', 'image', url),
    successTitle: 'Image importée',
  });

  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Bienvenue" value={hero.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <TextInput label="Sous-titre" placeholder="Découvrez..." value={hero.subtitle ?? ''} onChange={(e) => upd('subtitle', e.target.value)} />
      <Text size="sm" fw={500}>Image bannière</Text>
      <Text size="xs" c="dimmed" mb={4}>JPEG, PNG, GIF ou WebP — max 5 Mo</Text>
      <ImageDropzone
        imageUrl={hero.image ?? ''}
        onDrop={handleDrop}
        onRemove={() => updateNested('hero', 'image', '')}
        loading={loading}
        placeholder="Glissez une image ici ou cliquez pour choisir"
        imageStyle={{ maxWidth: 280, maxHeight: 120, objectFit: 'contain' }}
        maxSize={5 * 1024 * 1024}
      />
      <TextInput label="Texte du bouton" placeholder="Voir les produits" value={hero.cta ?? ''} onChange={(e) => upd('cta', e.target.value)} />
      <TextInput label="Lien du bouton" placeholder="/collections/all" value={hero.ctaHref ?? ''} onChange={(e) => upd('ctaHref', e.target.value)} />
      <Select
        label="Alignement du texte"
        data={[
          { value: 'left', label: 'Gauche' },
          { value: 'center', label: 'Centre' },
          { value: 'right', label: 'Droite' },
        ]}
        value={customization.heroAlignment ?? 'center'}
        onChange={(v) => update('heroAlignment', (v as 'left' | 'center' | 'right') ?? 'center')}
        comboboxProps={{ withinPortal: true, zIndex: 10000 }}
      />
      <Select
        label="Hauteur de la bannière"
        data={[
          { value: 'small', label: 'Petite' },
          { value: 'medium', label: 'Moyenne' },
          { value: 'large', label: 'Grande' },
        ]}
        value={customization.heroHeight ?? 'medium'}
        onChange={(v) => update('heroHeight', (v as 'small' | 'medium' | 'large') ?? 'medium')}
        comboboxProps={{ withinPortal: true, zIndex: 10000 }}
      />
    </Stack>
  );
}
