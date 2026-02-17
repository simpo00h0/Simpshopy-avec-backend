'use client';

import { useState, useEffect } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import { ThemeProvider } from '@/themes/ThemeContext';
import { ThemeLayout } from '@/themes/ThemeLayout';
import { themesData } from '@/themes/data';
import type { ThemeConfig, MockProduct } from '@/themes/data';

interface StoreCollection {
  id: string;
  slug: string;
  name: string;
  productIds: string[];
}

interface StoreData {
  id: string;
  name: string;
  subdomain: string;
  description?: string;
  logo?: string | null;
  themeId: string;
  themeCustomization?: ThemeCustomization | null;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
  }>;
  collections?: StoreCollection[];
}

function mapProducts(products: StoreData['products']): MockProduct[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    priceLabel: `${p.price.toLocaleString('fr-FR')} XOF`,
    description: p.description ?? '',
    imagePlaceholder: '📦',
    imageUrl: p.images?.[0],
  }));
}

function applyCustomization(base: ThemeConfig, cust: ThemeCustomization | null | undefined): ThemeConfig {
  if (!cust) return base;
  const result = { ...base };
  if (cust.logo) result.logo = cust.logo;
  if (cust.colors) {
    result.colors = { ...base.colors };
    if (cust.colors.primary) result.colors.primary = cust.colors.primary;
    if (cust.colors.secondary) result.colors.secondary = cust.colors.secondary;
    if (cust.colors.accent) result.colors.accent = cust.colors.accent;
    if (cust.colors.bg) result.colors.bg = cust.colors.bg;
    if (cust.colors.text) result.colors.text = cust.colors.text;
  }
  if (cust.hero) {
    if (cust.hero.title) result.heroTitle = cust.hero.title;
    if (cust.hero.subtitle) result.heroSubtitle = cust.hero.subtitle;
    if (cust.hero.image) result.heroImage = cust.hero.image;
    if (cust.hero.cta) result.heroCta = cust.hero.cta;
    if (cust.hero.ctaHref != null) result.heroCtaHref = cust.hero.ctaHref;
  }
  if (cust.richText) {
    if (cust.richText.heading) result.richTextHeading = cust.richText.heading;
    if (cust.richText.content) result.richTextContent = cust.richText.content;
  }
  if (cust.about) {
    if (cust.about.title) result.aboutTitle = cust.about.title;
    if (cust.about.content) result.aboutContent = cust.about.content;
  }
  if (cust.promoBanner) result.promoBanner = cust.promoBanner;
  if (cust.newsletterTitle) result.newsletterTitle = cust.newsletterTitle;
  if (cust.contact) {
    if (cust.contact.email) result.contactEmail = cust.contact.email;
    if (cust.contact.phone) result.contactPhone = cust.contact.phone;
  }
  if (cust.footer) {
    if (cust.footer.tagline) result.footerTagline = cust.footer.tagline;
    if (cust.footer.links?.length) result.footerLinks = cust.footer.links;
  }
  if (cust.featuredCarousel?.title) result.featuredCarouselTitle = cust.featuredCarousel.title;
  if (cust.featuredProducts) {
    if (cust.featuredProducts.title) result.featuredProductsTitle = cust.featuredProducts.title;
    if (cust.featuredProducts.limit != null) result.featuredProductsLimit = cust.featuredProducts.limit;
  }
  if (cust.testimonials) {
    if (cust.testimonials.title) result.testimonialsTitle = cust.testimonials.title;
    if (cust.testimonials.items?.length) result.testimonialsItems = cust.testimonials.items;
  }
  if (cust.categories) {
    if (cust.categories.title != null) result.categoriesTitle = cust.categories.title;
    if (cust.categories.limit != null) result.categoriesLimit = cust.categories.limit;
  }
  if (cust.video?.url) result.videoSection = { url: cust.video.url, title: cust.video.title };
  if (cust.imageText?.imageUrl || cust.imageText?.title || cust.imageText?.content) {
    result.imageTextSection = {
      imageUrl: cust.imageText.imageUrl ?? '',
      title: cust.imageText.title ?? '',
      content: cust.imageText.content ?? '',
      position: cust.imageText.position ?? 'left',
      ctaText: cust.imageText.ctaText,
      ctaHref: cust.imageText.ctaHref,
    };
  }
  if (cust.separator?.style) {
    result.separatorSection = {
      style: cust.separator.style,
      thickness: cust.separator.thickness,
      color: cust.separator.color,
    };
  }
  if (cust.ctaButtons?.primaryText && cust.ctaButtons?.primaryHref) {
    result.ctaButtons = {
      primaryText: cust.ctaButtons.primaryText,
      primaryHref: cust.ctaButtons.primaryHref,
      secondaryText: cust.ctaButtons.secondaryText,
      secondaryHref: cust.ctaButtons.secondaryHref,
    };
  }
  if (cust.faq?.items?.length) result.faqSection = { title: cust.faq.title, items: cust.faq.items };
  if (cust.socialLinks && Object.values(cust.socialLinks).some(Boolean)) result.socialLinks = cust.socialLinks;
  if (cust.trustBadges?.items?.length) result.trustBadges = { items: cust.trustBadges.items };
  if (cust.heroAlignment) result.heroAlignment = cust.heroAlignment;
  if (cust.heroHeight) result.heroHeight = cust.heroHeight;
  if (cust.countdown?.endDate) result.countdownSection = { endDate: cust.countdown.endDate, label: cust.countdown.label };
  if (cust.sectionOrder?.length) result.sectionOrder = cust.sectionOrder;
  if (cust.sectionVisibility) result.sectionVisibility = cust.sectionVisibility;
  return result;
}

const SIMPSHOPY_THEME_UPDATE = 'simpshopy-theme-update';
const SIMPSHOPY_PREVIEW_MODE = 'simpshopy-preview-mode';

export function StoreLayoutClient({ store, subdomain, children }: { store: StoreData; subdomain: string; children: React.ReactNode }) {
  const baseTheme = themesData[store.themeId] ?? themesData.classique;
  const products = mapProducts(store.products || []);

  const [liveCustomization, setLiveCustomization] = useState<ThemeCustomization | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsEditor(new URLSearchParams(window.location.search).get('editor') === '1');
  }, []);

  useEffect(() => {
    if (!isEditor) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === SIMPSHOPY_THEME_UPDATE && e.data.customization) {
        setLiveCustomization(e.data.customization);
      }
      if (e.data?.type === SIMPSHOPY_PREVIEW_MODE && typeof e.data.preview === 'boolean') {
        setPreviewMode(e.data.preview);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isEditor]);

  useEffect(() => {
    if (!isEditor) return;
    window.parent?.postMessage({ type: 'simpshopy-editor-ready' }, '*');
  }, [isEditor]);

  const effectiveCustomization = liveCustomization ?? store.themeCustomization;

  let theme: ThemeConfig = {
    ...baseTheme,
    storeName: store.name,
    logo: store.logo ?? undefined,
    products,
    collections: store.collections?.length ? store.collections : baseTheme.collections,
    footerTagline: `© ${store.name}`,
  };
  theme = applyCustomization(theme, effectiveCustomization);

  const basePath = '';

  return (
    <ThemeProvider
      theme={theme}
      basePath={basePath}
      storeSubdomain={subdomain}
      isPreview={false}
      isEditor={isEditor}
      isPreviewMode={isEditor && previewMode}
    >
      <ThemeLayout>{children}</ThemeLayout>
    </ThemeProvider>
  );
}
