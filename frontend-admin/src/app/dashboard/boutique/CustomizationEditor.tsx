'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Tabs,
  ColorInput,
  Accordion,
  Box,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { api } from '@/lib/api';
import type { ThemeCustomization } from '@/stores/storeStore';

const DEFAULT_CUSTOMIZATION: ThemeCustomization = {
  logo: '',
  colors: { primary: '', secondary: '', accent: '', bg: '', text: '' },
  hero: { title: '', subtitle: '', image: '', cta: '' },
  richText: { heading: '', content: '' },
  about: { title: '', content: '' },
  promoBanner: '',
  newsletterTitle: '',
  contact: { email: '', phone: '' },
  footer: { tagline: '', links: [] },
};

function mergeWithDefaults(current: ThemeCustomization | null | undefined): ThemeCustomization {
  if (!current) return { ...DEFAULT_CUSTOMIZATION };
  return {
    colors: { ...DEFAULT_CUSTOMIZATION.colors, ...current.colors },
    hero: { ...DEFAULT_CUSTOMIZATION.hero, ...current.hero },
    richText: { ...DEFAULT_CUSTOMIZATION.richText, ...current.richText },
    about: { ...DEFAULT_CUSTOMIZATION.about, ...current.about },
    promoBanner: current.promoBanner ?? '',
    newsletterTitle: current.newsletterTitle ?? '',
    contact: { ...DEFAULT_CUSTOMIZATION.contact, ...current.contact },
    footer: {
      tagline: current.footer?.tagline ?? '',
      links: current.footer?.links ?? [],
    },
  };
}

export function CustomizationEditor({
  storeId,
  currentCustomization,
  onSaved,
}: {
  storeId: string;
  currentCustomization: ThemeCustomization | null | undefined;
  onSaved?: () => void;
}) {
  const [cust, setCust] = useState<ThemeCustomization>(() => mergeWithDefaults(currentCustomization));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCust(mergeWithDefaults(currentCustomization));
  }, [currentCustomization]);

  const update = <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => {
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
      return {
        ...prev,
        [key]: { ...obj, [subKey]: value },
      };
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
      const payload: ThemeCustomization = {};
      if (cust.logo) payload.logo = cust.logo;
      if (cust.colors) {
        const c = cust.colors;
        if (c.primary || c.secondary || c.accent || c.bg || c.text) {
          payload.colors = Object.fromEntries(Object.entries(c).filter(([, v]) => v)) as ThemeCustomization['colors'];
        }
      }
      if (cust.hero && Object.values(cust.hero).some(Boolean)) payload.hero = cust.hero;
      if (cust.richText && (cust.richText.heading || cust.richText.content)) payload.richText = cust.richText;
      if (cust.about && (cust.about.title || cust.about.content)) payload.about = cust.about;
      if (cust.promoBanner) payload.promoBanner = cust.promoBanner;
      if (cust.newsletterTitle) payload.newsletterTitle = cust.newsletterTitle;
      if (cust.contact && (cust.contact.email || cust.contact.phone)) payload.contact = cust.contact;
      if (cust.footer && (cust.footer.tagline || (cust.footer.links?.length ?? 0) > 0)) payload.footer = cust.footer;

      await api.patch(`/stores/${storeId}/settings`, { themeCustomization: payload });
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
      <Accordion variant="contained" multiple defaultValue={['header', 'colors', 'hero']}>
        <Accordion.Item value="header">
          <Accordion.Control>
            <Title order={5}>En-tête (logo)</Title>
            <Text size="xs" c="dimmed">
              Logo affiché dans l&apos;en-tête de la boutique
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <TextInput
              label="URL du logo"
              placeholder="https://exemple.com/logo.png"
              value={cust.logo ?? ''}
              onChange={(e) => update('logo', e.target.value)}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="colors">
          <Accordion.Control>
            <Title order={5}>Couleurs</Title>
            <Text size="xs" c="dimmed">
              Personnalisez la palette de votre boutique
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Group grow>
                <ColorInput
                  label="Couleur principale"
                  placeholder="#1a1a2e"
                  value={cust.colors?.primary ?? ''}
                  onChange={(v) => updateNested('colors', 'primary', v)}
                />
                <ColorInput
                  label="Couleur secondaire"
                  placeholder="#16213e"
                  value={cust.colors?.secondary ?? ''}
                  onChange={(v) => updateNested('colors', 'secondary', v)}
                />
              </Group>
              <Group grow>
                <ColorInput
                  label="Couleur d'accent"
                  placeholder="#0f3460"
                  value={cust.colors?.accent ?? ''}
                  onChange={(v) => updateNested('colors', 'accent', v)}
                />
                <ColorInput
                  label="Fond"
                  placeholder="#f8f9fa"
                  value={cust.colors?.bg ?? ''}
                  onChange={(v) => updateNested('colors', 'bg', v)}
                />
              </Group>
              <ColorInput
                label="Texte"
                placeholder="#212529"
                value={cust.colors?.text ?? ''}
                onChange={(v) => updateNested('colors', 'text', v)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="hero">
          <Accordion.Control>
            <Title order={5}>Bannière principale (Hero)</Title>
            <Text size="xs" c="dimmed">
              Titre, sous-titre et image de la page d&apos;accueil
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Titre"
                placeholder="Bienvenue dans notre boutique"
                value={cust.hero?.title ?? ''}
                onChange={(e) => updateNested('hero', 'title', e.target.value)}
              />
              <TextInput
                label="Sous-titre"
                placeholder="Découvrez une sélection soignée"
                value={cust.hero?.subtitle ?? ''}
                onChange={(e) => updateNested('hero', 'subtitle', e.target.value)}
              />
              <TextInput
                label="URL de l'image (bannière)"
                placeholder="https://images.unsplash.com/..."
                value={cust.hero?.image ?? ''}
                onChange={(e) => updateNested('hero', 'image', e.target.value)}
              />
              <TextInput
                label="Texte du bouton"
                placeholder="Voir les produits"
                value={cust.hero?.cta ?? ''}
                onChange={(e) => updateNested('hero', 'cta', e.target.value)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="promo">
          <Accordion.Control>
            <Title order={5}>Bannière promo</Title>
            <Text size="xs" c="dimmed">
              Message promotionnel en haut de page
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <TextInput
              placeholder="Livraison gratuite dès 25 000 XOF — Zone CFA"
              value={cust.promoBanner ?? ''}
              onChange={(e) => update('promoBanner', e.target.value)}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="richText">
          <Accordion.Control>
            <Title order={5}>Section texte enrichi</Title>
            <Text size="xs" c="dimmed">
              Bloc de contenu sur la page d&apos;accueil
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Titre"
                placeholder="À propos de nous"
                value={cust.richText?.heading ?? ''}
                onChange={(e) => updateNested('richText', 'heading', e.target.value)}
              />
              <Textarea
                label="Contenu"
                placeholder="Nous sélectionnons avec soin..."
                rows={4}
                value={cust.richText?.content ?? ''}
                onChange={(e) => updateNested('richText', 'content', e.target.value)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="about">
          <Accordion.Control>
            <Title order={5}>Page À propos</Title>
            <Text size="xs" c="dimmed">
              Contenu de la page À propos
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Titre"
                placeholder="Pourquoi nous choisir ?"
                value={cust.about?.title ?? ''}
                onChange={(e) => updateNested('about', 'title', e.target.value)}
              />
              <Textarea
                label="Contenu"
                placeholder="Qualité garantie, livraison rapide..."
                rows={4}
                value={cust.about?.content ?? ''}
                onChange={(e) => updateNested('about', 'content', e.target.value)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="newsletter">
          <Accordion.Control>
            <Title order={5}>Newsletter</Title>
            <Text size="xs" c="dimmed">
              Titre de la section inscription
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <TextInput
              placeholder="Restez informé de nos offres"
              value={cust.newsletterTitle ?? ''}
              onChange={(e) => update('newsletterTitle', e.target.value)}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="contact">
          <Accordion.Control>
            <Title order={5}>Contact</Title>
            <Text size="xs" c="dimmed">
              Email et téléphone affichés
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Email"
                placeholder="contact@maboutique.com"
                type="email"
                value={cust.contact?.email ?? ''}
                onChange={(e) => updateNested('contact', 'email', e.target.value)}
              />
              <TextInput
                label="Téléphone"
                placeholder="+221 33 XXX XX XX"
                value={cust.contact?.phone ?? ''}
                onChange={(e) => updateNested('contact', 'phone', e.target.value)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="footer">
          <Accordion.Control>
            <Title order={5}>Pied de page</Title>
            <Text size="xs" c="dimmed">
              Tagline et liens du footer
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Tagline"
                placeholder="© Ma Boutique — Tous droits réservés"
                value={cust.footer?.tagline ?? ''}
                onChange={(e) =>
                  update('footer', { ...cust.footer, tagline: e.target.value, links: cust.footer?.links ?? [] })
                }
              />
              <Text size="sm" fw={500}>
                Liens
              </Text>
              {(cust.footer?.links ?? []).map((link, idx) => (
                <Group key={idx} gap="xs">
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
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group justify="flex-end">
        <Button color="green" onClick={handleSave} loading={saving}>
          {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
        </Button>
      </Group>
    </Stack>
  );
}
