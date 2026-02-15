'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockCountdownSettings({ customization, update }: BlockSettingsProps) {
  const cd = customization.countdown;
  return (
    <Stack gap="sm">
      <TextInput label="Date et heure de fin (ISO)" placeholder="2025-12-31T23:59:59" value={cd?.endDate ?? ''} onChange={(e) => update('countdown', { ...cd, endDate: e.target.value })} />
      <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={cd?.label ?? ''} onChange={(e) => update('countdown', { ...cd, label: e.target.value })} />
    </Stack>
  );
}
