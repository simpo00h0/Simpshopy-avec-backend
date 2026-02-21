'use client';

import { NumberInput, Stack, Text, Textarea, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

const DEFAULT_ITEMS = [
  { name: 'Amina K.', text: 'Excellente boutique !', rating: 5 },
  { name: 'Moussa D.', text: 'Livraison rapide.', rating: 5 },
  { name: 'Fatou S.', text: 'Très satisfaite.', rating: 5 },
];

export function BlockTestimonialsSettings({ customization, update }: BlockSettingsProps) {
  const tm = customization.testimonials ?? {};
  const items = tm.items?.length ? tm.items : DEFAULT_ITEMS;
  const upd = (k: keyof typeof tm, v: unknown) => update('testimonials', { ...tm, [k]: v });

  const updateItem = (idx: number, field: 'name' | 'text' | 'rating', value: string | number) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    upd('items', newItems);
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Titre"
        placeholder="Ce que disent nos clients"
        value={tm.title ?? ''}
        onChange={(e) => upd('title', e.target.value)}
      />
      <Text size="xs" fw={500}>
        Témoignages
      </Text>
      {items.map((item, idx) => (
        <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
          <TextInput
            size="xs"
            placeholder="Nom"
            value={item.name}
            onChange={(e) => updateItem(idx, 'name', e.target.value)}
          />
          <Textarea
            size="xs"
            placeholder="Témoignage"
            rows={2}
            value={item.text}
            onChange={(e) => updateItem(idx, 'text', e.target.value)}
          />
          <NumberInput
            size="xs"
            placeholder="Note 1-5"
            min={1}
            max={5}
            value={item.rating}
            onChange={(v) => updateItem(idx, 'rating', typeof v === 'string' ? parseInt(v, 10) || 5 : v)}
          />
        </Stack>
      ))}
    </Stack>
  );
}
