'use client';

import { Stack, TextInput } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockCtaButtonsSettings({ customization, update }: BlockSettingsProps) {
  const cta = customization.ctaButtons;
  return (
    <Stack gap="sm">
      <TextInput label="Bouton principal - Texte" placeholder="Voir les produits" value={cta?.primaryText ?? ''} onChange={(e) => update('ctaButtons', { ...cta, primaryText: e.target.value })} />
      <TextInput label="Bouton principal - Lien" placeholder="/products" value={cta?.primaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...cta, primaryHref: e.target.value })} />
      <TextInput label="Bouton secondaire - Texte (optionnel)" value={cta?.secondaryText ?? ''} onChange={(e) => update('ctaButtons', { ...cta, secondaryText: e.target.value })} />
      <TextInput label="Bouton secondaire - Lien" value={cta?.secondaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...cta, secondaryHref: e.target.value })} />
    </Stack>
  );
}
