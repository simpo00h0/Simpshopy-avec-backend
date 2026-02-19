'use client';

import { Stack, TextInput, SegmentedControl, Text } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';
import { CountdownDateTimeModal } from './CountdownDateTimeModal';

type CountdownSize = 'grand' | 'moyen' | 'petit';

export function BlockCountdownSettings({ customization, update }: BlockSettingsProps) {
  const cd = customization.countdown;
  const size = (cd?.size as CountdownSize) ?? 'grand';

  const handleDateChange = (iso: string) => {
    update('countdown', { ...cd, endDate: iso });
  };

  return (
    <Stack gap="sm">
      <CountdownDateTimeModal
        value={cd?.endDate ?? ''}
        onChange={handleDateChange}
      />
      <Text size="sm" fw={500} mb={4}>
        Taille
      </Text>
      <SegmentedControl
        value={size}
        onChange={(v) => update('countdown', { ...cd, size: (v as CountdownSize) ?? 'grand' })}
        data={[
          { value: 'grand', label: 'Grand' },
          { value: 'moyen', label: 'Moyen' },
          { value: 'petit', label: 'Petit' },
        ]}
        fullWidth
      />
      <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={cd?.label ?? ''} onChange={(e) => update('countdown', { ...cd, label: e.target.value })} />
    </Stack>
  );
}
