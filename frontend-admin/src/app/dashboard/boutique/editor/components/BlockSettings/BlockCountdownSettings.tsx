'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';
import { CountdownDateTimeModal } from './CountdownDateTimeModal';

export function BlockCountdownSettings({ customization, update }: BlockSettingsProps) {
  const cd = customization.countdown;

  const handleDateChange = (iso: string) => {
    update('countdown', { ...cd, endDate: iso });
  };

  return (
    <Stack gap="sm">
      <CountdownDateTimeModal
        value={cd?.endDate ?? ''}
        onChange={handleDateChange}
      />
      <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={cd?.label ?? ''} onChange={(e) => update('countdown', { ...cd, label: e.target.value })} />
    </Stack>
  );
}
