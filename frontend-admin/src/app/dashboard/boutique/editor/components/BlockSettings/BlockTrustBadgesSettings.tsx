'use client';

import { ActionIcon, Button, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockTrustBadgesSettings({ customization, update }: BlockSettingsProps) {
  const items = customization.trustBadges?.items?.length ? customization.trustBadges.items : [{ icon: '🔒', text: 'Paiement sécurisé' }];

  const updateItem = (idx: number, field: 'icon' | 'text', value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    update('trustBadges', { items: newItems });
  };

  return (
    <Stack gap="sm">
      <Text size="xs" c="dimmed">
        Ex. Paiement sécurisé, Livraison rapide
      </Text>
      {items.map((item, idx) => (
        <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
          <TextInput
            size="xs"
            placeholder="Emoji ou icône (optionnel)"
            value={item.icon ?? ''}
            onChange={(e) => updateItem(idx, 'icon', e.target.value)}
          />
          <TextInput
            size="xs"
            placeholder="Texte"
            value={item.text}
            onChange={(e) => updateItem(idx, 'text', e.target.value)}
          />
          <ActionIcon
            size="sm"
            color="red"
            variant="subtle"
            onClick={() => update('trustBadges', { items: items.filter((_, i) => i !== idx) })}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Stack>
      ))}
      <Button
        size="xs"
        variant="light"
        leftSection={<IconPlus size={14} />}
        onClick={() => update('trustBadges', { items: [...items, { text: '' }] })}
      >
        Ajouter un badge
      </Button>
    </Stack>
  );
}
