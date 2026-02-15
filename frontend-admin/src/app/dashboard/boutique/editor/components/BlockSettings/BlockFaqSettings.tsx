'use client';

import { ActionIcon, Button, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFaqSettings({ customization, update }: BlockSettingsProps) {
  const items = customization.faq?.items?.length ? customization.faq.items : [{ question: '', answer: '' }];

  const updateItem = (idx: number, field: 'question' | 'answer', value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    update('faq', { ...customization.faq, items: newItems });
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Titre section"
        placeholder="Questions fréquentes"
        value={customization.faq?.title ?? ''}
        onChange={(e) => update('faq', { ...customization.faq, title: e.target.value })}
      />
      <Text size="xs" fw={500}>
        Questions / Réponses
      </Text>
      {items.map((item, idx) => (
        <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
          <TextInput
            size="xs"
            placeholder="Question"
            value={item.question}
            onChange={(e) => updateItem(idx, 'question', e.target.value)}
          />
          <Textarea
            size="xs"
            placeholder="Réponse"
            rows={2}
            value={item.answer}
            onChange={(e) => updateItem(idx, 'answer', e.target.value)}
          />
          <ActionIcon
            size="sm"
            color="red"
            variant="subtle"
            onClick={() => update('faq', { ...customization.faq, items: items.filter((_, i) => i !== idx) })}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Stack>
      ))}
      <Button
        size="xs"
        variant="light"
        leftSection={<IconPlus size={14} />}
        onClick={() => update('faq', { ...customization.faq, items: [...items, { question: '', answer: '' }] })}
      >
        Ajouter une question
      </Button>
    </Stack>
  );
}
