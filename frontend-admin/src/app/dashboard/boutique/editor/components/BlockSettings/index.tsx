'use client';

import { NumberInput, Select, Stack, TextInput, Textarea } from '@mantine/core';
import type { BlockId } from '../../editor-types';
import type { BlockSettingsProps } from '../../editor-types';
import { BlockColorsSettings } from './BlockColorsSettings';
import { BlockFaqSettings } from './BlockFaqSettings';
import { BlockFooterSettings } from './BlockFooterSettings';
import { BlockHeroSettings } from './BlockHeroSettings';
import { BlockTestimonialsSettings } from './BlockTestimonialsSettings';
import { BlockTrustBadgesSettings } from './BlockTrustBadgesSettings';

type BlockSettingsRenderer = (props: BlockSettingsProps) => React.ReactNode;

const BLOCK_SETTINGS_MAP: Partial<Record<BlockId, BlockSettingsRenderer>> = {
  header: (p) => (
    <Stack gap="sm">
      <TextInput label="URL du logo" placeholder="https://..." value={p.customization.logo ?? ''} onChange={(e) => p.update('logo', e.target.value)} />
    </Stack>
  ),
  promoBanner: (p) => (
    <Stack gap="sm">
      <TextInput label="Message promo" placeholder="Livraison gratuite dès 25 000 XOF" value={p.customization.promoBanner ?? ''} onChange={(e) => p.update('promoBanner', e.target.value)} />
    </Stack>
  ),
  hero: (p) => <BlockHeroSettings {...p} />,
  richText: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos de nous" value={p.customization.richText?.heading ?? ''} onChange={(e) => p.updateNested('richText', 'heading', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={p.customization.richText?.content ?? ''} onChange={(e) => p.updateNested('richText', 'content', e.target.value)} />
    </Stack>
  ),
  featuredCarousel: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre du carousel" placeholder="Nouveautés" value={p.customization.featuredCarousel?.title ?? ''} onChange={(e) => p.update('featuredCarousel', { ...p.customization.featuredCarousel, title: e.target.value })} />
    </Stack>
  ),
  featuredProducts: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Tous nos produits" value={p.customization.featuredProducts?.title ?? ''} onChange={(e) => p.update('featuredProducts', { ...p.customization.featuredProducts, title: e.target.value })} />
      <NumberInput label="Nombre de produits" placeholder="6" min={2} max={24} value={p.customization.featuredProducts?.limit ?? 6} onChange={(v) => p.update('featuredProducts', { ...p.customization.featuredProducts, limit: typeof v === 'string' ? parseInt(v, 10) || 6 : v })} />
    </Stack>
  ),
  testimonials: (p) => <BlockTestimonialsSettings {...p} />,
  newsletter: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Restez informé" value={p.customization.newsletterTitle ?? ''} onChange={(e) => p.update('newsletterTitle', e.target.value)} />
    </Stack>
  ),
  footer: (p) => <BlockFooterSettings {...p} />,
  colors: (p) => <BlockColorsSettings {...p} />,
  contact: (p) => (
    <Stack gap="sm">
      <TextInput label="Email" placeholder="contact@..." value={p.customization.contact?.email ?? ''} onChange={(e) => p.updateNested('contact', 'email', e.target.value)} />
      <TextInput label="Téléphone" placeholder="+221..." value={p.customization.contact?.phone ?? ''} onChange={(e) => p.updateNested('contact', 'phone', e.target.value)} />
    </Stack>
  ),
  about: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos" value={p.customization.about?.title ?? ''} onChange={(e) => p.updateNested('about', 'title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={p.customization.about?.content ?? ''} onChange={(e) => p.updateNested('about', 'content', e.target.value)} />
    </Stack>
  ),
  categories: (p) => (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Parcourir par catégorie" value={p.customization.categories?.title ?? ''} onChange={(e) => p.update('categories', { ...p.customization.categories, title: e.target.value })} />
      <NumberInput label="Nombre max de catégories" placeholder="Toutes" min={1} max={12} value={p.customization.categories?.limit ?? undefined} onChange={(v) => p.update('categories', { ...p.customization.categories, limit: typeof v === 'string' ? undefined : v })} />
    </Stack>
  ),
  video: (p) => (
    <Stack gap="sm">
      <TextInput label="URL vidéo" placeholder="https://youtube.com/... ou https://vimeo.com/..." value={p.customization.video?.url ?? ''} onChange={(e) => p.update('video', { ...p.customization.video, url: e.target.value })} />
      <TextInput label="Titre (optionnel)" placeholder="Notre vidéo" value={p.customization.video?.title ?? ''} onChange={(e) => p.update('video', { ...p.customization.video, title: e.target.value })} />
    </Stack>
  ),
  imageText: (p) => (
    <Stack gap="sm">
      <TextInput label="URL image" placeholder="https://..." value={p.customization.imageText?.imageUrl ?? ''} onChange={(e) => p.update('imageText', { ...p.customization.imageText, imageUrl: e.target.value })} />
      <TextInput label="Titre" placeholder="Notre histoire" value={p.customization.imageText?.title ?? ''} onChange={(e) => p.update('imageText', { ...p.customization.imageText, title: e.target.value })} />
      <Textarea label="Contenu" placeholder="Texte..." rows={3} value={p.customization.imageText?.content ?? ''} onChange={(e) => p.update('imageText', { ...p.customization.imageText, content: e.target.value })} />
      <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={p.customization.imageText?.position ?? 'left'} onChange={(v) => p.update('imageText', { ...p.customization.imageText, position: (v as 'left' | 'right') ?? 'left' })} />
      <TextInput label="Texte bouton (optionnel)" value={p.customization.imageText?.ctaText ?? ''} onChange={(e) => p.update('imageText', { ...p.customization.imageText, ctaText: e.target.value })} />
      <TextInput label="Lien bouton" placeholder="/products" value={p.customization.imageText?.ctaHref ?? ''} onChange={(e) => p.update('imageText', { ...p.customization.imageText, ctaHref: e.target.value })} />
    </Stack>
  ),
  separator: (p) => (
    <Stack gap="sm">
      <Select label="Style" data={[{ value: 'line', label: 'Ligne' }, { value: 'dashed', label: 'Tirets' }, { value: 'dotted', label: 'Pointillé' }, { value: 'space', label: 'Espace' }]} value={p.customization.separator?.style ?? 'line'} onChange={(v) => p.update('separator', { ...p.customization.separator, style: (v as 'line' | 'space' | 'dotted' | 'dashed') ?? 'line' })} />
      <NumberInput label="Épaisseur (px)" min={1} max={100} value={p.customization.separator?.thickness ?? 2} onChange={(v) => p.update('separator', { ...p.customization.separator, thickness: typeof v === 'string' ? 2 : v })} />
      <TextInput label="Couleur (optionnel)" placeholder="#ccc" value={p.customization.separator?.color ?? ''} onChange={(e) => p.update('separator', { ...p.customization.separator, color: e.target.value })} />
    </Stack>
  ),
  countdown: (p) => (
    <Stack gap="sm">
      <TextInput label="Date et heure de fin (ISO)" placeholder="2025-12-31T23:59:59" value={p.customization.countdown?.endDate ?? ''} onChange={(e) => p.update('countdown', { ...p.customization.countdown, endDate: e.target.value })} />
      <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={p.customization.countdown?.label ?? ''} onChange={(e) => p.update('countdown', { ...p.customization.countdown, label: e.target.value })} />
    </Stack>
  ),
  ctaButtons: (p) => (
    <Stack gap="sm">
      <TextInput label="Bouton principal - Texte" placeholder="Voir les produits" value={p.customization.ctaButtons?.primaryText ?? ''} onChange={(e) => p.update('ctaButtons', { ...p.customization.ctaButtons, primaryText: e.target.value })} />
      <TextInput label="Bouton principal - Lien" placeholder="/products" value={p.customization.ctaButtons?.primaryHref ?? ''} onChange={(e) => p.update('ctaButtons', { ...p.customization.ctaButtons, primaryHref: e.target.value })} />
      <TextInput label="Bouton secondaire - Texte (optionnel)" value={p.customization.ctaButtons?.secondaryText ?? ''} onChange={(e) => p.update('ctaButtons', { ...p.customization.ctaButtons, secondaryText: e.target.value })} />
      <TextInput label="Bouton secondaire - Lien" value={p.customization.ctaButtons?.secondaryHref ?? ''} onChange={(e) => p.update('ctaButtons', { ...p.customization.ctaButtons, secondaryHref: e.target.value })} />
    </Stack>
  ),
  faq: (p) => <BlockFaqSettings {...p} />,
  socialLinks: (p) => (
    <Stack gap="sm">
      <TextInput label="Facebook (URL)" placeholder="https://facebook.com/..." value={p.customization.socialLinks?.facebook ?? ''} onChange={(e) => p.update('socialLinks', { ...p.customization.socialLinks, facebook: e.target.value })} />
      <TextInput label="Instagram (URL)" placeholder="https://instagram.com/..." value={p.customization.socialLinks?.instagram ?? ''} onChange={(e) => p.update('socialLinks', { ...p.customization.socialLinks, instagram: e.target.value })} />
      <TextInput label="WhatsApp (URL ou numéro)" placeholder="+221771234567" value={p.customization.socialLinks?.whatsapp ?? ''} onChange={(e) => p.update('socialLinks', { ...p.customization.socialLinks, whatsapp: e.target.value })} />
      <TextInput label="Twitter / X (URL)" placeholder="https://twitter.com/..." value={p.customization.socialLinks?.twitter ?? ''} onChange={(e) => p.update('socialLinks', { ...p.customization.socialLinks, twitter: e.target.value })} />
    </Stack>
  ),
  trustBadges: (p) => <BlockTrustBadgesSettings {...p} />,
};

interface BlockSettingsDispatchProps extends BlockSettingsProps {
  selectedBlock: BlockId;
}

export function BlockSettings({ selectedBlock, customization, update, updateNested }: BlockSettingsDispatchProps) {
  const render = BLOCK_SETTINGS_MAP[selectedBlock];
  return render ? render({ customization, update, updateNested }) : null;
}
