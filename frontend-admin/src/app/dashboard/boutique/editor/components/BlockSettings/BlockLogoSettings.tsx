'use client';

import { useState } from 'react';
import { ActionIcon, Box, Group, Select, Stack, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconTrash, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { uploadImage } from '@/lib/upload-service';
import type { BlockSettingsProps } from '../../editor-types';

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
    setLogoLoading(true);
    const result = await uploadImage(file);
    setLogoLoading(false);
    if (result.success && result.url) {
      update('logo', result.url);
      notifications.show({ title: 'Logo importé', message: LOGO_SIZE_HINT, color: 'green' });
    } else {
      notifications.show({ title: 'Échec de l\'import', message: 'Réessayez ou utilisez une autre image.', color: 'red' });
    }
  };

  const handleFaviconDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFaviconLoading(true);
    const result = await uploadImage(file);
    setFaviconLoading(false);
    if (result.success && result.url) {
      update('favicon', result.url);
      notifications.show({ title: 'Favicon importé', message: FAVICON_SIZE_HINT, color: 'green' });
    } else {
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
      <Dropzone onDrop={handleLogoDrop} maxSize={2 * 1024 * 1024} accept={IMAGE_MIME_TYPE} loading={logoLoading} maxFiles={1}>
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
              Glissez le logo ici ou cliquez pour choisir
            </Text>
          </div>
        </Group>
      </Dropzone>
      {logoUrl && (
        <Group gap="xs" align="center" wrap="nowrap">
          <Box
            component="img"
            src={logoUrl}
            alt="Logo"
            style={{ width: 60, height: 24, objectFit: 'contain', flexShrink: 0 }}
          />
          <Text size="xs" c="green" style={{ flex: 1 }}>
            Logo configuré
          </Text>
          <ActionIcon
            size="sm"
            color="red"
            variant="subtle"
            aria-label="Supprimer le logo"
            onClick={() => update('logo', '')}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      )}

      <Text size="sm" fw={500}>
        Favicon
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {FAVICON_SIZE_HINT}
      </Text>
      <Dropzone onDrop={handleFaviconDrop} maxSize={512 * 1024} accept={IMAGE_MIME_TYPE} loading={faviconLoading} maxFiles={1}>
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
              Glissez le favicon ici ou cliquez pour choisir
            </Text>
          </div>
        </Group>
      </Dropzone>
      {faviconUrl && (
        <Group gap="xs" align="center" wrap="nowrap">
          <Box
            component="img"
            src={faviconUrl}
            alt="Favicon"
            style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }}
          />
          <Text size="xs" c="green" style={{ flex: 1 }}>
            Favicon configuré
          </Text>
          <ActionIcon
            size="sm"
            color="red"
            variant="subtle"
            aria-label="Supprimer le favicon"
            onClick={() => update('favicon', '')}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      )}

      <Select
        label="Position du logo dans l'en-tête"
        data={[
          { value: 'left', label: 'Gauche' },
          { value: 'center', label: 'Centre' },
          { value: 'right', label: 'Droite' },
        ]}
        value={logoAlignment}
        allowDeselect={false}
        onChange={(v) => {
          const val = (v as 'left' | 'center' | 'right') || 'left';
          update('logoAlignment', val);
        }}
      />
    </Stack>
  );
}
