'use client';

import { useState } from 'react';
import { SegmentedControl, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { uploadImage } from '@/lib/upload-service';
import type { BlockSettingsProps } from '../../editor-types';
import { ImageDropzone, LOGO_FAVICON_MIME } from './ImageDropzone';

const LOGO_SIZE_HINT = 'Recommandé : 120–400 px de large, PNG ou SVG';
const FAVICON_SIZE_HINT = 'Recommandé : 32×32 ou 64×64 px, format carré (ICO, PNG)';

export function BlockLogoSettings({ customization, update }: BlockSettingsProps) {
  const [logoLoading, setLogoLoading] = useState(false);
  const [faviconLoading, setFaviconLoading] = useState(false);

  const logoUrl = (customization as { logo?: string }).logo ?? '';
  const faviconUrl = (customization as { favicon?: string }).favicon ?? '';
  const logoAlignment = (customization as { logoAlignment?: 'left' | 'center' | 'right' }).logoAlignment ?? 'left';

  const handleLogoDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Lecture impossible'));
      reader.readAsDataURL(file);
    });
    update('logo', dataUrl);
    setLogoLoading(true);
    const result = await uploadImage(file);
    setLogoLoading(false);
    if (result.success && result.url) {
      update('logo', result.url);
      notifications.show({ title: 'Logo importé', message: LOGO_SIZE_HINT, color: 'green' });
    } else {
      update('logo', '');
      notifications.show({ title: 'Échec de l\'import', message: 'Réessayez ou utilisez une autre image.', color: 'red' });
    }
  };

  const handleFaviconDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Lecture impossible'));
      reader.readAsDataURL(file);
    });
    update('favicon', dataUrl);
    setFaviconLoading(true);
    const result = await uploadImage(file);
    setFaviconLoading(false);
    if (result.success && result.url) {
      update('favicon', result.url);
      notifications.show({ title: 'Favicon importé', message: FAVICON_SIZE_HINT, color: 'green' });
    } else {
      update('favicon', '');
      notifications.show({ title: 'Échec de l\'import', message: 'Réessayez ou utilisez une autre image.', color: 'red' });
    }
  };

  return (
    <Stack gap="md">
      <Text size="xs" c="dimmed">
        Logo et favicon : importez depuis votre appareil. Pas d&apos;URL.
      </Text>

      <Text size="sm" fw={500}>
        Logo
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {LOGO_SIZE_HINT}
      </Text>
      <ImageDropzone
        imageUrl={logoUrl}
        onDrop={handleLogoDrop}
        onRemove={() => update('logo', '')}
        loading={logoLoading}
        placeholder="Glissez le logo ici ou cliquez pour choisir"
        imageStyle={{ maxWidth: 200, maxHeight: 60, objectFit: 'contain' }}
        maxSize={2 * 1024 * 1024}
        accept={LOGO_FAVICON_MIME}
      />

      <Text size="sm" fw={500}>
        Favicon
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {FAVICON_SIZE_HINT}
      </Text>
      <ImageDropzone
        imageUrl={faviconUrl}
        onDrop={handleFaviconDrop}
        onRemove={() => update('favicon', '')}
        loading={faviconLoading}
        placeholder="Glissez le favicon ici ou cliquez pour choisir"
        imageStyle={{ width: 48, height: 48, objectFit: 'contain' }}
        maxSize={512 * 1024}
        accept={LOGO_FAVICON_MIME}
      />

      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        <Text size="sm" fw={500} mb={4}>
          Position du logo dans l&apos;en-tête
        </Text>
        <SegmentedControl
          value={logoAlignment}
          onChange={(v) => {
            const val = (v as 'left' | 'center' | 'right') || 'left';
            update('logoAlignment', val);
          }}
          data={[
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' },
          ]}
          fullWidth
        />
      </div>
    </Stack>
  );
}
