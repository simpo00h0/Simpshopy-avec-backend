'use client';

import { SegmentedControl, Stack, Text } from '@mantine/core';
import { ImageLibraryPicker } from '@/components/ImageLibraryPicker';
import type { BlockSettingsProps } from '../../editor-types';

const LOGO_SIZE_HINT = 'Recommandé : 120–400 px de large, PNG ou SVG';
const FAVICON_SIZE_HINT = 'Recommandé : 32×32 ou 64×64 px, format carré (ICO, PNG)';

export function BlockLogoSettings({ customization, update }: BlockSettingsProps) {
  const logoUrl = (customization as { logo?: string }).logo ?? '';
  const faviconUrl = (customization as { favicon?: string }).favicon ?? '';
  const logoAlignment = (customization as { logoAlignment?: 'left' | 'center' | 'right' }).logoAlignment ?? 'left';

  return (
    <Stack gap="md">
      <Text size="xs" c="dimmed">
        Logo et favicon : sélectionnez depuis la bibliothèque.
      </Text>

      <Text size="sm" fw={500}>
        Logo
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {LOGO_SIZE_HINT}
      </Text>
      <ImageLibraryPicker
        imageUrl={logoUrl}
        onSelect={(url) => update('logo', url)}
        onRemove={() => update('logo', '')}
        placeholder="Cliquez pour choisir le logo"
        imageStyle={{ maxWidth: 200, maxHeight: 60, objectFit: 'contain' }}
      />

      <Text size="sm" fw={500}>
        Favicon
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        {FAVICON_SIZE_HINT}
      </Text>
      <ImageLibraryPicker
        imageUrl={faviconUrl}
        onSelect={(url) => update('favicon', url)}
        onRemove={() => update('favicon', '')}
        placeholder="Cliquez pour choisir le favicon"
        imageStyle={{ width: 48, height: 48, objectFit: 'contain' }}
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
