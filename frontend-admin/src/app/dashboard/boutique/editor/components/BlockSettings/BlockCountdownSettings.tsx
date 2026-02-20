'use client';

import { Stack, TextInput, SegmentedControl, Text, SimpleGrid, UnstyledButton } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { BlockSettingsProps } from '../../editor-types';
import { CountdownDateTimeModal } from './CountdownDateTimeModal';

type CountdownSize = 'grand' | 'moyen' | 'petit';
type CountdownStyle = 'simple' | 'flip' | 'circle' | 'boxed' | 'dotted' | 'pill' | 'outline' | 'glow' | 'minimal';

const VARIANTS: { id: CountdownStyle; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'flip', label: 'Flip' },
  { id: 'circle', label: 'Cercle' },
  { id: 'boxed', label: 'Encadré' },
  { id: 'dotted', label: 'Pointillé' },
  { id: 'pill', label: 'Pilule' },
  { id: 'outline', label: 'Contour' },
  { id: 'glow', label: 'Lueur' },
  { id: 'minimal', label: 'Minimal' },
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
    <Stack gap="md">
      <CountdownDateTimeModal value={cd?.endDate ?? ''} onChange={handleDateChange} />
      <TextInput
        label="Titre (optionnel)"
        placeholder="Offre se termine dans"
        value={cd?.label ?? ''}
        onChange={(e) => update('countdown', { ...cd, label: e.target.value })}
      />
      <div>
        <Text size="sm" fw={500} mb="xs">
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
      </div>
      <div>
        <Text size="sm" fw={500} mb="xs">
          Style
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          {VARIANTS.map((v) => {
            const isActive = style === v.id;
            return (
              <UnstyledButton
                key={v.id}
                onClick={() => applyVariant(v.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--mantine-radius-sm)',
                  border: `1px solid ${isActive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-default-border)'}`,
                  backgroundColor: isActive ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                title={v.label}
              >
                <Text size="sm" fw={isActive ? 600 : 500}>
                  {v.label}
                </Text>
                {isActive && <IconCheck size={14} color="var(--mantine-color-green-6)" />}
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
