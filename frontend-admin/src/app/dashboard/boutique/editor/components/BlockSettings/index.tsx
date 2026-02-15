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

interface BlockSettingsDispatchProps extends BlockSettingsProps {
  selectedBlock: BlockId;
}

export function BlockSettings({ selectedBlock, customization, update, updateNested }: BlockSettingsDispatchProps) {
  if (selectedBlock === 'header') {
    return (
      <Stack gap="sm">
        <TextInput label="URL du logo" placeholder="https://..." value={customization.logo ?? ''} onChange={(e) => update('logo', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'promoBanner') {
    return (
      <Stack gap="sm">
        <TextInput label="Message promo" placeholder="Livraison gratuite dès 25 000 XOF" value={customization.promoBanner ?? ''} onChange={(e) => update('promoBanner', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'hero') return <BlockHeroSettings customization={customization} update={update} updateNested={updateNested} />;
  if (selectedBlock === 'richText') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="À propos de nous" value={customization.richText?.heading ?? ''} onChange={(e) => updateNested('richText', 'heading', e.target.value)} />
        <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.richText?.content ?? ''} onChange={(e) => updateNested('richText', 'content', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'featuredCarousel') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre du carousel" placeholder="Nouveautés" value={customization.featuredCarousel?.title ?? ''} onChange={(e) => update('featuredCarousel', { ...customization.featuredCarousel, title: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'featuredProducts') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="Tous nos produits" value={customization.featuredProducts?.title ?? ''} onChange={(e) => update('featuredProducts', { ...customization.featuredProducts, title: e.target.value })} />
        <NumberInput label="Nombre de produits" placeholder="6" min={2} max={24} value={customization.featuredProducts?.limit ?? 6} onChange={(v) => update('featuredProducts', { ...customization.featuredProducts, limit: typeof v === 'string' ? parseInt(v, 10) || 6 : v })} />
      </Stack>
    );
  }
  if (selectedBlock === 'testimonials') return <BlockTestimonialsSettings customization={customization} update={update} updateNested={updateNested} />;
  if (selectedBlock === 'newsletter') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="Restez informé" value={customization.newsletterTitle ?? ''} onChange={(e) => update('newsletterTitle', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'footer') return <BlockFooterSettings customization={customization} update={update} updateNested={updateNested} />;
  if (selectedBlock === 'colors') return <BlockColorsSettings customization={customization} update={update} updateNested={updateNested} />;
  if (selectedBlock === 'contact') {
    return (
      <Stack gap="sm">
        <TextInput label="Email" placeholder="contact@..." value={customization.contact?.email ?? ''} onChange={(e) => updateNested('contact', 'email', e.target.value)} />
        <TextInput label="Téléphone" placeholder="+221..." value={customization.contact?.phone ?? ''} onChange={(e) => updateNested('contact', 'phone', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'about') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="À propos" value={customization.about?.title ?? ''} onChange={(e) => updateNested('about', 'title', e.target.value)} />
        <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.about?.content ?? ''} onChange={(e) => updateNested('about', 'content', e.target.value)} />
      </Stack>
    );
  }
  if (selectedBlock === 'categories') {
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="Parcourir par catégorie" value={customization.categories?.title ?? ''} onChange={(e) => update('categories', { ...customization.categories, title: e.target.value })} />
        <NumberInput label="Nombre max de catégories" placeholder="Toutes" min={1} max={12} value={customization.categories?.limit ?? undefined} onChange={(v) => update('categories', { ...customization.categories, limit: typeof v === 'string' ? undefined : v })} />
      </Stack>
    );
  }
  if (selectedBlock === 'video') {
    return (
      <Stack gap="sm">
        <TextInput label="URL vidéo" placeholder="https://youtube.com/... ou https://vimeo.com/..." value={customization.video?.url ?? ''} onChange={(e) => update('video', { ...customization.video, url: e.target.value })} />
        <TextInput label="Titre (optionnel)" placeholder="Notre vidéo" value={customization.video?.title ?? ''} onChange={(e) => update('video', { ...customization.video, title: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'imageText') {
    return (
      <Stack gap="sm">
        <TextInput label="URL image" placeholder="https://..." value={customization.imageText?.imageUrl ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, imageUrl: e.target.value })} />
        <TextInput label="Titre" placeholder="Notre histoire" value={customization.imageText?.title ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, title: e.target.value })} />
        <Textarea label="Contenu" placeholder="Texte..." rows={3} value={customization.imageText?.content ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, content: e.target.value })} />
        <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={customization.imageText?.position ?? 'left'} onChange={(v) => update('imageText', { ...customization.imageText, position: (v as 'left' | 'right') ?? 'left' })} />
        <TextInput label="Texte bouton (optionnel)" value={customization.imageText?.ctaText ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, ctaText: e.target.value })} />
        <TextInput label="Lien bouton" placeholder="/products" value={customization.imageText?.ctaHref ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, ctaHref: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'separator') {
    return (
      <Stack gap="sm">
        <Select label="Style" data={[{ value: 'line', label: 'Ligne' }, { value: 'dashed', label: 'Tirets' }, { value: 'dotted', label: 'Pointillé' }, { value: 'space', label: 'Espace' }]} value={customization.separator?.style ?? 'line'} onChange={(v) => update('separator', { ...customization.separator, style: (v as 'line' | 'space' | 'dotted' | 'dashed') ?? 'line' })} />
        <NumberInput label="Épaisseur (px)" min={1} max={100} value={customization.separator?.thickness ?? 2} onChange={(v) => update('separator', { ...customization.separator, thickness: typeof v === 'string' ? 2 : v })} />
        <TextInput label="Couleur (optionnel)" placeholder="#ccc" value={customization.separator?.color ?? ''} onChange={(e) => update('separator', { ...customization.separator, color: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'countdown') {
    return (
      <Stack gap="sm">
        <TextInput label="Date et heure de fin (ISO)" placeholder="2025-12-31T23:59:59" value={customization.countdown?.endDate ?? ''} onChange={(e) => update('countdown', { ...customization.countdown, endDate: e.target.value })} />
        <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={customization.countdown?.label ?? ''} onChange={(e) => update('countdown', { ...customization.countdown, label: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'ctaButtons') {
    return (
      <Stack gap="sm">
        <TextInput label="Bouton principal - Texte" placeholder="Voir les produits" value={customization.ctaButtons?.primaryText ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, primaryText: e.target.value })} />
        <TextInput label="Bouton principal - Lien" placeholder="/products" value={customization.ctaButtons?.primaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, primaryHref: e.target.value })} />
        <TextInput label="Bouton secondaire - Texte (optionnel)" value={customization.ctaButtons?.secondaryText ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, secondaryText: e.target.value })} />
        <TextInput label="Bouton secondaire - Lien" value={customization.ctaButtons?.secondaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, secondaryHref: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'faq') return <BlockFaqSettings customization={customization} update={update} updateNested={updateNested} />;
  if (selectedBlock === 'socialLinks') {
    return (
      <Stack gap="sm">
        <TextInput label="Facebook (URL)" placeholder="https://facebook.com/..." value={customization.socialLinks?.facebook ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, facebook: e.target.value })} />
        <TextInput label="Instagram (URL)" placeholder="https://instagram.com/..." value={customization.socialLinks?.instagram ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, instagram: e.target.value })} />
        <TextInput label="WhatsApp (URL ou numéro)" placeholder="+221771234567" value={customization.socialLinks?.whatsapp ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, whatsapp: e.target.value })} />
        <TextInput label="Twitter / X (URL)" placeholder="https://twitter.com/..." value={customization.socialLinks?.twitter ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, twitter: e.target.value })} />
      </Stack>
    );
  }
  if (selectedBlock === 'trustBadges') return <BlockTrustBadgesSettings customization={customization} update={update} updateNested={updateNested} />;
  return null;
}
