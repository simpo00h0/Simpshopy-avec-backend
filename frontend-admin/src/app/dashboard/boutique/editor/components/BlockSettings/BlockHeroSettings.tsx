'use client';

import { useState } from 'react';
import { Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api, UPLOAD_BASE_URL } from '@/lib/api';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockHeroSettings({ customization, update, updateNested }: BlockSettingsProps) {
  const [loading, setLoading] = useState(false);

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
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>('/upload/image', formData);
      const fullUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE_URL}${data.url}`;
      updateNested('hero', 'image', fullUrl);
      notifications.show({ title: 'Image importée', message: '', color: 'green' });
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Erreur lors de l'import";
      notifications.show({ title: 'Erreur', message: String(msg ?? 'Erreur inconnue'), color: 'red' });
      updateNested('hero', 'image', '');
    } finally {
      setLoading(false);
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
      <Dropzone onDrop={handleDrop} maxSize={5 * 1024 * 1024} accept={IMAGE_MIME_TYPE} loading={loading} maxFiles={1}>
        <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={40} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconUpload size={40} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>
          <div>
            <Text size="sm" inline>
              Glissez une image ici ou cliquez pour choisir
            </Text>
            <Text size="xs" c="dimmed" inline mt={4} display="block">
              JPEG, PNG, GIF ou WebP — max 5 Mo
            </Text>
          </div>
        </Group>
      </Dropzone>
      <TextInput
        label="Texte du bouton"
        placeholder="Voir les produits"
        value={customization.hero?.cta ?? ''}
        onChange={(e) => updateNested('hero', 'cta', e.target.value)}
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
