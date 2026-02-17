'use client';

import { useState } from 'react';
import { Select, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { uploadImage } from '@/lib/upload-service';
import type { BlockSettingsProps } from '../../editor-types';
import { ImageDropzone } from './ImageDropzone';

export function BlockHeroSettings({ customization, update, updateNested }: BlockSettingsProps) {
  const [loading, setLoading] = useState(false);
  const heroImage = customization.hero?.image ?? '';

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Lecture impossible'));
      reader.readAsDataURL(file);
    });
    updateNested('hero', 'image', dataUrl);
    setLoading(true);
    const result = await uploadImage(file);
    setLoading(false);

    if (result.success && result.url) {
      updateNested('hero', 'image', result.url);
      notifications.show({ title: 'Image importée', message: '', color: 'green' });
    } else {
      updateNested('hero', 'image', '');
    }
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Titre"
        placeholder="Bienvenue"
        value={customization.hero?.title ?? ''}
        onChange={(e) => updateNested('hero', 'title', e.target.value)}
      />
      <TextInput
        label="Sous-titre"
        placeholder="Découvrez..."
        value={customization.hero?.subtitle ?? ''}
        onChange={(e) => updateNested('hero', 'subtitle', e.target.value)}
      />
      <Text size="sm" fw={500}>
        Image bannière
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        JPEG, PNG, GIF ou WebP — max 5 Mo
      </Text>
      <ImageDropzone
        imageUrl={heroImage}
        onDrop={handleDrop}
        onRemove={() => updateNested('hero', 'image', '')}
        loading={loading}
        placeholder="Glissez une image ici ou cliquez pour choisir"
        imageStyle={{ maxWidth: 280, maxHeight: 120, objectFit: 'contain' }}
        maxSize={5 * 1024 * 1024}
      />
      <TextInput
        label="Texte du bouton"
        placeholder="Voir les produits"
        value={customization.hero?.cta ?? ''}
        onChange={(e) => updateNested('hero', 'cta', e.target.value)}
      />
      <TextInput
        label="Lien du bouton"
        placeholder="/collections/all"
        value={customization.hero?.ctaHref ?? ''}
        onChange={(e) => updateNested('hero', 'ctaHref', e.target.value)}
      />
      <Select
        label="Alignement du texte"
        data={[
          { value: 'left', label: 'Gauche' },
          { value: 'center', label: 'Centre' },
          { value: 'right', label: 'Droite' },
        ]}
        value={customization.heroAlignment ?? 'center'}
        onChange={(v) => update('heroAlignment', (v as 'left' | 'center' | 'right') ?? 'center')}
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
      />
    </Stack>
  );
}
