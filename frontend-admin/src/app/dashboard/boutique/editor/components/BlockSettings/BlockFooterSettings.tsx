'use client';

import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockFooterSettings({ customization, update }: BlockSettingsProps) {
  const footer = customization.footer ?? {};
  const links = footer.links ?? [];
  const upd = (k: keyof typeof footer, v: unknown) => update('footer', { ...footer, [k]: v });

  return (
    <Stack gap="sm">
      <TextInput
        label="Tagline"
        placeholder="© Ma Boutique"
        value={footer.tagline ?? ''}
        onChange={(e) => upd('tagline', e.target.value)}
      />
      <Text size="xs" fw={500}>
        Liens
      </Text>
      {links.map((link, idx) => (
        <Group key={idx} gap="xs" wrap="wrap" grow style={{ minWidth: 0 }}>
          <TextInput
            placeholder="Label"
            size="xs"
            value={link.label}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[idx] = { ...newLinks[idx], label: e.target.value };
              upd('links', newLinks);
            }}
            style={{ minWidth: 0, flex: 1 }}
          />
          <TextInput
            placeholder="/collections/all"
            size="xs"
            value={link.href}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[idx] = { ...newLinks[idx], href: e.target.value };
              upd('links', newLinks);
            }}
            style={{ minWidth: 0, flex: 1 }}
          />
          <ActionIcon size="sm" color="red" variant="subtle" onClick={() => upd('links', links.filter((_, i) => i !== idx))}>
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      ))}
      <Button
        size="xs"
        variant="light"
        leftSection={<IconPlus size={14} />}
        onClick={() => upd('links', [...links, { label: '', href: '' }])}
      >
        Ajouter un lien
      </Button>
    </Stack>
  );
}
