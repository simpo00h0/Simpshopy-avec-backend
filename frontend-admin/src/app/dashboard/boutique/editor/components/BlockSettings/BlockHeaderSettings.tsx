'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockHeaderSettings({ customization, update }: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <TextInput label="URL du logo" placeholder="https://..." value={customization.logo ?? ''} onChange={(e) => update('logo', e.target.value)} />
    </Stack>
  );
}
