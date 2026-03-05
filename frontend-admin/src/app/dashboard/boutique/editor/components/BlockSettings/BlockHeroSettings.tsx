'use client';

import { Select, Stack, Text, TextInput } from '@mantine/core';
import { ImageLibraryPicker } from '@/components/ImageLibraryPicker';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockHeroSettings({ customization, update, updateNested }: BlockSettingsProps) {
  const hero = customization.hero ?? {};
  const upd = (k: keyof typeof hero, v: string) => updateNested('hero', k, v);

  return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Bienvenue" value={hero.title ?? ''} onChange={(e) => upd('title', e.target.value)} />
      <TextInput label="Sous-titre" placeholder="Découvrez..." value={hero.subtitle ?? ''} onChange={(e) => upd('subtitle', e.target.value)} />
      <Text size="sm" fw={500}>Image bannière</Text>
      <Text size="xs" c="dimmed" mb={4}>Sélectionnez une image depuis la bibliothèque.</Text>
      <ImageLibraryPicker
        imageUrl={hero.image ?? ''}
        onSelect={(url) => updateNested('hero', 'image', url)}
        onRemove={() => updateNested('hero', 'image', '')}
        placeholder="Cliquez pour choisir une image"
        imageStyle={{ maxWidth: 280, maxHeight: 120, objectFit: 'contain' }}
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
