import type { BlocksMap } from './block-instance';

/** Structure de personnalisation du thème (surcharge les valeurs par défaut du thème) */
export interface ThemeCustomization {
  /** Blocs par instance (chaque bloc canvas a son propre ID et données) */
  blocks?: BlocksMap;
  logo?: string;
  favicon?: string;
  logoAlignment?: 'left' | 'center' | 'right';
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    bg?: string;
    text?: string;
  };
  hero?: {
    title?: string;
    subtitle?: string;
    image?: string;
    cta?: string;
    ctaHref?: string;
  };
  richText?: { heading?: string; content?: string };
  about?: { title?: string; content?: string };
  promoBanner?: string;
  newsletterTitle?: string;
  contact?: { email?: string; phone?: string };
  footer?: { tagline?: string; links?: { label: string; href: string }[] };
  featuredCarousel?: { title?: string };
  featuredProducts?: { title?: string; limit?: number };
  testimonials?: { title?: string; items?: { name: string; text: string; rating: number }[] };
  categories?: { title?: string; limit?: number };
  video?: { url?: string; title?: string };
  imageText?: {
    imageUrl?: string;
    title?: string;
    content?: string;
    position?: 'left' | 'right';
    ctaText?: string;
    ctaHref?: string;
  };
  separator?: { style?: 'line' | 'space' | 'dotted' | 'dashed'; thickness?: number; color?: string };
  countdown?: { endDate?: string; label?: string; size?: 'grand' | 'moyen' | 'petit' };
  ctaButtons?: {
    primaryText?: string;
    primaryHref?: string;
    secondaryText?: string;
    secondaryHref?: string;
  };
  faq?: { title?: string; items?: { question: string; answer: string }[] };
  socialLinks?: { facebook?: string; instagram?: string; whatsapp?: string; twitter?: string };
  trustBadges?: { items?: { icon?: string; text: string }[] };
  heroAlignment?: 'left' | 'center' | 'right';
  heroHeight?: 'small' | 'medium' | 'large';
  sectionOrder?: string[];
  sectionVisibility?: Record<string, boolean>;
}
