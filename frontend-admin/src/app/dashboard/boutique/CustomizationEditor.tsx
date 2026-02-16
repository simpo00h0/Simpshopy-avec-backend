'use client';

import { useState, useEffect } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { api } from '@/lib/api';
import type { ThemeCustomization } from '@/stores/storeStore';
import { mergeWithDefaults, buildPayload } from './customization-editor-utils';
import { CustomizationAccordionSections } from './CustomizationAccordionSections';

export function CustomizationEditor({
  storeId,
  currentCustomization,
  onSaved,
}: {
  storeId: string;
  currentCustomization: ThemeCustomization | null | undefined;
  onSaved?: () => void;
}) {
  const [cust, setCust] = useState<ThemeCustomization>(() =>
    mergeWithDefaults(currentCustomization)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCust(mergeWithDefaults(currentCustomization));
  }, [currentCustomization]);

  const update = <K extends keyof ThemeCustomization>(
    key: K,
    value: ThemeCustomization[K]
  ) => {
    setCust((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = <K extends keyof ThemeCustomization>(
    key: K,
    subKey: string,
    value: string
  ) => {
    setCust((prev) => {
      const obj = prev[key];
      if (typeof obj !== 'object' || obj === null) return prev;
      return { ...prev, [key]: { ...obj, [subKey]: value } };
    });
  };

  const addFooterLink = () => {
    setCust((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: [...(prev.footer?.links ?? []), { label: '', href: '' }],
      },
    }));
  };

  const updateFooterLink = (idx: number, field: 'label' | 'href', value: string) => {
    setCust((prev) => {
      const links = [...(prev.footer?.links ?? [])];
      if (!links[idx]) return prev;
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, footer: { ...prev.footer, links } };
    });
  };

  const removeFooterLink = (idx: number) => {
    setCust((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: (prev.footer?.links ?? []).filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = buildPayload(cust);
      await api.patch(`/stores/${storeId}/settings`, {
        themeCustomization: payload,
      });
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="lg">
      <CustomizationAccordionSections
        cust={cust}
        update={update}
        updateNested={updateNested}
        addFooterLink={addFooterLink}
        updateFooterLink={updateFooterLink}
        removeFooterLink={removeFooterLink}
      />
      <Group justify="flex-end">
        <Button color="green" onClick={handleSave} loading={saving}>
          {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
        </Button>
      </Group>
    </Stack>
  );
}
