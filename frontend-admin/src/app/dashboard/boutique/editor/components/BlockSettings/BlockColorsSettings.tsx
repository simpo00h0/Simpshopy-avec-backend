'use client';

import { Button, ColorInput, Divider, Group, Stack, Text } from '@mantine/core';
import { COLOR_PRESETS } from '../../editor-constants';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockColorsSettings({ customization, update }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <Text size="xs" fw={600}>
        Presets (appliquer en un clic)
      </Text>
      <Group gap="xs">
        {Object.entries(COLOR_PRESETS).map(([name, c]) => (
          <Button key={name} size="xs" variant="light" onClick={() => update('colors', c)}>
            {name}
          </Button>
        ))}
      </Group>
      <Divider />
      <ColorInput
        label="Couleur principale"
        value={customization.colors?.primary ?? ''}
        onChange={(v) => update('colors', { ...customization.colors, primary: v })}
      />
      <ColorInput
        label="Couleur secondaire"
        value={customization.colors?.secondary ?? ''}
        onChange={(v) => update('colors', { ...customization.colors, secondary: v })}
      />
      <ColorInput
        label="Accent"
        value={customization.colors?.accent ?? ''}
        onChange={(v) => update('colors', { ...customization.colors, accent: v })}
      />
      <ColorInput
        label="Fond"
        value={customization.colors?.bg ?? ''}
        onChange={(v) => update('colors', { ...customization.colors, bg: v })}
      />
      <ColorInput
        label="Texte"
        value={customization.colors?.text ?? ''}
        onChange={(v) => update('colors', { ...customization.colors, text: v })}
      />
    </Stack>
  );
}
