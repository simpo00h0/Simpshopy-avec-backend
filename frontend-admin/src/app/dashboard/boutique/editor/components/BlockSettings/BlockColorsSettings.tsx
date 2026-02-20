'use client';

import { Button, ColorInput, Divider, Group, Stack, Text } from '@mantine/core';
import { COLOR_PRESETS } from '../../editor-constants';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockColorsSettings({ customization, update }: BlockSettingsProps) {
  const colors = customization.colors ?? {};
  const upd = (k: keyof typeof colors, v: string) => update('colors', { ...colors, [k]: v });
  return (
    <Stack gap="sm">
      <Text size="xs" fw={600}>Presets (appliquer en un clic)</Text>
      <Group gap="xs">
        {Object.entries(COLOR_PRESETS).map(([name, c]) => (
          <Button key={name} size="xs" variant="light" onClick={() => update('colors', c)}>{name}</Button>
        ))}
      </Group>
      <Divider />
      <ColorInput label="Couleur principale" value={colors.primary ?? ''} onChange={upd.bind(null, 'primary')} />
      <ColorInput label="Couleur secondaire" value={colors.secondary ?? ''} onChange={upd.bind(null, 'secondary')} />
      <ColorInput label="Accent" value={colors.accent ?? ''} onChange={upd.bind(null, 'accent')} />
      <ColorInput label="Fond" value={colors.bg ?? ''} onChange={upd.bind(null, 'bg')} />
      <ColorInput label="Texte" value={colors.text ?? ''} onChange={upd.bind(null, 'text')} />
    </Stack>
  );
}
