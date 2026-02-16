import type { ThemeCustomization } from '@/stores/storeStore';

export const DEFAULT_CUSTOMIZATION: ThemeCustomization = {
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

export function mergeWithDefaults(
  current: ThemeCustomization | null | undefined
): ThemeCustomization {
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

export function buildPayload(cust: ThemeCustomization): ThemeCustomization {
  const payload: ThemeCustomization = {};
  if (cust.logo) payload.logo = cust.logo;
  if (cust.colors) {
    const c = cust.colors;
    if (c.primary || c.secondary || c.accent || c.bg || c.text) {
      payload.colors = Object.fromEntries(
        Object.entries(c).filter(([, v]) => v)
      ) as ThemeCustomization['colors'];
    }
  }
  if (cust.hero && Object.values(cust.hero).some(Boolean)) payload.hero = cust.hero;
  if (cust.richText && (cust.richText.heading || cust.richText.content))
    payload.richText = cust.richText;
  if (cust.about && (cust.about.title || cust.about.content)) payload.about = cust.about;
  if (cust.promoBanner) payload.promoBanner = cust.promoBanner;
  if (cust.newsletterTitle) payload.newsletterTitle = cust.newsletterTitle;
  if (cust.contact && (cust.contact.email || cust.contact.phone))
    payload.contact = cust.contact;
  if (
    cust.footer &&
    (cust.footer.tagline || (cust.footer.links?.length ?? 0) > 0)
  )
    payload.footer = cust.footer;
  return payload;
}
