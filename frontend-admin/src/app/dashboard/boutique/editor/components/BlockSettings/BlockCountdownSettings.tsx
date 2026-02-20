'use client';

import { Stack, TextInput, SegmentedControl, Text, Group, Paper, UnstyledButton } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { BlockSettingsProps } from '../../editor-types';
import { CountdownDateTimeModal } from './CountdownDateTimeModal';

type CountdownSize = 'grand' | 'moyen' | 'petit';
type CountdownStyle = 'simple' | 'flip' | 'circle';

const VARIANTS: { id: CountdownStyle; label: string; desc: string }[] = [
  { id: 'simple', label: 'Simple', desc: 'Chiffres plats' },
  { id: 'flip', label: 'Flip', desc: 'Cartes style horloge' },
  { id: 'circle', label: 'Cercle', desc: 'Unités en cercles' },
];

export function BlockCountdownSettings({ customization, update }: BlockSettingsProps) {
  const cd = customization.countdown;
  const size = (cd?.size as CountdownSize) ?? 'grand';
  const style = (cd?.style as CountdownStyle) ?? 'simple';

  const handleDateChange = (iso: string) => {
    update('countdown', { ...cd, endDate: iso });
  };

  const applyVariant = (id: CountdownStyle) => {
    update('countdown', { ...cd, style: id });
  };

  return (
    <Stack gap="sm">
      <CountdownDateTimeModal value={cd?.endDate ?? ''} onChange={handleDateChange} />
      <Text size="sm" fw={500} mb={4}>
        Style du countdown
      </Text>
      <Stack gap="xs">
        {VARIANTS.map((v) => (
          <Paper key={v.id} p="xs" withBorder>
            <Group justify="space-between" wrap="nowrap">
              <div>
                <Text size="sm" fw={500}>{v.label}</Text>
                <Text size="xs" c="dimmed">{v.desc}</Text>
              </div>
              <UnstyledButton
                onClick={() => applyVariant(v.id)}
                style={{
                  opacity: style === v.id ? 0.6 : 1,
                  cursor: style === v.id ? 'default' : 'pointer',
                }}
                title={style === v.id ? 'Style actif' : 'Appliquer ce style'}
              >
                <Group gap={4}>
                  <IconDownload size={14} />
                  <Text size="xs">{style === v.id ? 'Actif' : 'Appliquer'}</Text>
                </Group>
              </UnstyledButton>
            </Group>
          </Paper>
        ))}
      </Stack>
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
      <TextInput
        label="Titre (optionnel)"
        placeholder="Offre se termine dans"
        value={cd?.label ?? ''}
        onChange={(e) => update('countdown', { ...cd, label: e.target.value })}
      />
    </Stack>
  );
}
