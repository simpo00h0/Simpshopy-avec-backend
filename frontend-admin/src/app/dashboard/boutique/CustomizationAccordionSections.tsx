'use client';

import {
  Accordion,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  ColorInput,
} from '@mantine/core';
import type { ThemeCustomization } from '@/stores/storeStore';
import { FooterSectionForm } from './FooterSectionForm';

type UpdateFn = <K extends keyof ThemeCustomization>(
  key: K,
  value: ThemeCustomization[K]
) => void;
type UpdateNestedFn = <K extends keyof ThemeCustomization>(
  key: K,
  subKey: string,
  value: string
) => void;

interface CustomizationAccordionSectionsProps {
  cust: ThemeCustomization;
  update: UpdateFn;
  updateNested: UpdateNestedFn;
  addFooterLink: () => void;
  updateFooterLink: (idx: number, field: 'label' | 'href', value: string) => void;
  removeFooterLink: (idx: number) => void;
}

export function CustomizationAccordionSections({
  cust,
  update,
  updateNested,
  addFooterLink,
  updateFooterLink,
  removeFooterLink,
}: CustomizationAccordionSectionsProps) {
  return (
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
          <FooterSectionForm
            cust={cust}
            update={update}
            addFooterLink={addFooterLink}
            updateFooterLink={updateFooterLink}
            removeFooterLink={removeFooterLink}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
