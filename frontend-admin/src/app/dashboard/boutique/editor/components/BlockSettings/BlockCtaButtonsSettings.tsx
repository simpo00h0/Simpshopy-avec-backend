'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockCtaButtonsSettings({ customization, update }: BlockSettingsProps) {
  const cta = customization.ctaButtons ?? {};
  const upd = (k: keyof typeof cta, v: unknown) => update('ctaButtons', { ...cta, [k]: v });
  return (
    <Stack gap="sm">
      <TextInput label="Bouton principal - Texte" placeholder="Voir les produits" value={cta.primaryText ?? ''} onChange={(e) => upd('primaryText', e.target.value)} />
      <TextInput label="Bouton principal - Lien" placeholder="/collections/all" value={cta.primaryHref ?? ''} onChange={(e) => upd('primaryHref', e.target.value)} />
      <TextInput label="Bouton secondaire - Texte (optionnel)" value={cta.secondaryText ?? ''} onChange={(e) => upd('secondaryText', e.target.value)} />
      <TextInput label="Bouton secondaire - Lien" value={cta.secondaryHref ?? ''} onChange={(e) => upd('secondaryHref', e.target.value)} />
    </Stack>
  );
}
