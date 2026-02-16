'use client';

import { TextInput, Button, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { ThemeCustomization } from '@/stores/storeStore';

type UpdateFn = <K extends keyof ThemeCustomization>(
  key: K,
  value: ThemeCustomization[K]
) => void;

interface FooterSectionFormProps {
  cust: ThemeCustomization;
  update: UpdateFn;
  addFooterLink: () => void;
  updateFooterLink: (idx: number, field: 'label' | 'href', value: string) => void;
  removeFooterLink: (idx: number) => void;
}

export function FooterSectionForm({
  cust,
  update,
  addFooterLink,
  updateFooterLink,
  removeFooterLink,
}: FooterSectionFormProps) {
  return (
    <Stack gap="sm">
      <TextInput
        label="Tagline"
        placeholder="© Ma Boutique — Tous droits réservés"
        value={cust.footer?.tagline ?? ''}
        onChange={(e) =>
          update('footer', {
            ...cust.footer,
            tagline: e.target.value,
            links: cust.footer?.links ?? [],
          })
        }
      />
      <Text size="sm" fw={500}>
        Liens
      </Text>
      {(cust.footer?.links ?? []).map((link, idx) => (
        <Group key={`${link.href}-${link.label}-${idx}`} gap="xs">
          <TextInput
            placeholder="Label"
            value={link.label}
            onChange={(e) => updateFooterLink(idx, 'label', e.target.value)}
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="/products ou https://..."
            value={link.href}
            onChange={(e) => updateFooterLink(idx, 'href', e.target.value)}
            style={{ flex: 1 }}
          />
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => removeFooterLink(idx)}
            aria-label="Supprimer"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Button
        leftSection={<IconPlus size={16} />}
        variant="light"
        size="xs"
        onClick={addFooterLink}
      >
        Ajouter un lien
      </Button>
    </Stack>
  );
}
