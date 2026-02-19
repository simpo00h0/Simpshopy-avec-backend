import type { ThemeConfig } from './theme-types';
import type { BlockInstance } from '@simpshopy/shared';

/** Convertit les données d'un bloc en surcharges pour le thème (pour le rendu) */
export function blockDataToThemeOverrides(
  block: BlockInstance,
  baseTheme: ThemeConfig
): Partial<ThemeConfig> {
  const { type, data } = block;
  const d = data as Record<string, unknown>;

  switch (type) {
    case 'hero':
      return {
        heroTitle: (d.title as string) ?? baseTheme.heroTitle,
        heroSubtitle: (d.subtitle as string) ?? baseTheme.heroSubtitle,
        heroImage: (d.image as string) ?? baseTheme.heroImage,
        heroCta: (d.cta as string) ?? baseTheme.heroCta,
        heroCtaHref: (d.ctaHref as string) ?? baseTheme.heroCtaHref,
        heroAlignment: (d.heroAlignment as ThemeConfig['heroAlignment']) ?? baseTheme.heroAlignment,
        heroHeight: (d.heroHeight as ThemeConfig['heroHeight']) ?? baseTheme.heroHeight,
      };
    case 'promoBanner':
      return { promoBanner: (d.text as string) ?? baseTheme.promoBanner };
    case 'richText':
      return {
        richTextHeading: (d.heading as string) ?? baseTheme.richTextHeading,
        richTextContent: (d.content as string) ?? baseTheme.richTextContent,
      };
    case 'categories':
      return {
        categoriesTitle: (d.title as string) ?? baseTheme.categoriesTitle,
        categoriesLimit: (d.limit as number) ?? baseTheme.categoriesLimit,
      };
    case 'featuredCarousel':
      return { featuredCarouselTitle: (d.title as string) ?? baseTheme.featuredCarouselTitle };
    case 'featuredProducts':
      return {
        featuredProductsTitle: (d.title as string) ?? baseTheme.featuredProductsTitle,
        featuredProductsLimit: (d.limit as number) ?? baseTheme.featuredProductsLimit,
      };
    case 'countdown':
      return {
        countdownSection: {
          endDate: (d.endDate as string) ?? '',
          label: (d.label as string),
          size: (d.size as 'grand' | 'moyen' | 'petit') ?? 'grand',
        },
      };
    case 'video':
      return {
        videoSection: {
          url: (d.url as string) ?? '',
          title: (d.title as string),
        },
      };
    case 'imageText':
      return {
        imageTextSection: {
          imageUrl: (d.imageUrl as string) ?? '',
          title: (d.title as string) ?? '',
          content: (d.content as string) ?? '',
          position: (d.position as 'left' | 'right') ?? 'left',
          ctaText: (d.ctaText as string),
          ctaHref: (d.ctaHref as string),
        },
      };
    case 'separator':
      return {
        separatorSection: d.style
          ? {
              style: (d.style as 'line' | 'space' | 'dotted' | 'dashed'),
              thickness: (d.thickness as number),
              color: (d.color as string),
            }
          : baseTheme.separatorSection,
      };
    case 'ctaButtons':
      return {
        ctaButtons:
          d.primaryText && d.primaryHref
            ? {
                primaryText: d.primaryText as string,
                primaryHref: d.primaryHref as string,
                secondaryText: d.secondaryText as string,
                secondaryHref: d.secondaryHref as string,
              }
            : baseTheme.ctaButtons,
      };
    case 'testimonials':
      return {
        testimonialsTitle: (d.title as string) ?? baseTheme.testimonialsTitle,
        testimonialsItems: (d.items as ThemeConfig['testimonialsItems']) ?? baseTheme.testimonialsItems,
      };
    case 'faq':
      return {
        faqSection:
          (d.items as { question: string; answer: string }[])?.length
            ? { title: (d.title as string), items: d.items as { question: string; answer: string }[] }
            : baseTheme.faqSection,
      };
    case 'socialLinks':
      return d && Object.values(d).some(Boolean)
        ? { socialLinks: d as ThemeConfig['socialLinks'] }
        : { socialLinks: baseTheme.socialLinks };
    case 'trustBadges':
      return {
        trustBadges:
          (d.items as { icon?: string; text: string }[])?.length
            ? { items: d.items as { icon?: string; text: string }[] }
            : baseTheme.trustBadges,
      };
    case 'newsletter':
      return { newsletterTitle: (d.title as string) ?? baseTheme.newsletterTitle };
    default:
      return {};
  }
}
