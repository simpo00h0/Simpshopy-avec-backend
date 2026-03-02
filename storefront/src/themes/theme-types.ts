export interface MockProduct {
  id: string;
  /** Slug pour l'URL et les liens internes (ex: produit-premium). Requis, comme Shopify. */
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  imagePlaceholder: string;
  imageUrl?: string;
  category?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  niche: string;
  storeName: string;
  logo?: string;
  favicon?: string;
  logoAlignment?: 'left' | 'center' | 'right';
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  heroCta?: string;
  heroCtaHref?: string;
  richTextHeading?: string;
  richTextContent?: string;
  aboutTitle?: string;
  aboutContent?: string;
  promoBanner?: string;
  newsletterTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  colors: { primary: string; secondary: string; accent: string; bg: string; text: string };
  products: MockProduct[];
  collections?: { id: string; slug: string; name: string; productIds: string[] }[];
  footerTagline: string;
  footerLinks?: { label: string; href: string }[];
  featuredCarouselTitle?: string;
  featuredProductsTitle?: string;
  featuredProductsLimit?: number;
  testimonialsTitle?: string;
  testimonialsItems?: { name: string; text: string; rating: number }[];
  categoriesTitle?: string;
  categoriesLimit?: number;
  videoSection?: { url: string; title?: string };
  imageTextSection?: {
    imageUrl: string;
    title: string;
    content: string;
    position: 'left' | 'right';
    ctaText?: string;
    ctaHref?: string;
  };
  countdownSection?: { endDate: string; label?: string; size?: 'grand' | 'moyen' | 'petit'; style?: string };
  ctaButtons?: { primaryText: string; primaryHref: string; secondaryText?: string; secondaryHref?: string };
  faqSection?: { title?: string; items: { question: string; answer: string }[] };
  socialLinks?: { facebook?: string; instagram?: string; whatsapp?: string; twitter?: string };
  trustBadges?: { items: { icon?: string; text: string }[] };
  heroAlignment?: 'left' | 'center' | 'right';
  heroHeight?: 'small' | 'medium' | 'large';
  sectionOrder?: string[];
  sectionVisibility?: Record<string, boolean>;
  /** Blocs par instance (chaque bloc a son propre ID et données) */
  blocks?: Record<string, { type: string; data: Record<string, unknown> }>;
  logoBlockId?: string;
}
