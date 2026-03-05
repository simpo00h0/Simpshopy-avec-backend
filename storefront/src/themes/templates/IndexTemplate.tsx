'use client';

import React from 'react';
import { useTheme, BlockThemeProvider } from '../ThemeContext';
import { useEditorCanvasDrag } from '../EditorCanvasDragContext';
import { BlockWrapper } from '../BlockWrapper';
import { CanvasDropZone } from '../CanvasDropZone';
import { PromoBannerSection } from '../sections/PromoBannerSection';
import { HeroSection } from '../sections/HeroSection';
import { RichTextSection } from '../sections/RichTextSection';
import { CategoriesSection } from '../sections/CategoriesSection';
import { FeaturedCollectionCarousel } from '../sections/FeaturedCollectionCarousel';
import { FeaturedProductsSection } from '../sections/FeaturedProductsSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { NewsletterSection } from '../sections/NewsletterSection';
import { VideoSection } from '../sections/VideoSection';
import { ImageTextSection } from '../sections/ImageTextSection';
import { CtaButtonsSection } from '../sections/CtaButtonsSection';
import { FaqSection } from '../sections/FaqSection';
import { SocialLinksSection } from '../sections/SocialLinksSection';
import { TrustBadgesSection } from '../sections/TrustBadgesSection';
import { CountdownSection } from '../sections/CountdownSection';
import { blockDataToThemeOverrides } from '../block-theme-overrides';
import type { ThemeConfig } from '../theme-types';

const DEFAULT_ORDER = [
  'promoBanner', 'hero', 'richText', 'categories', 'featuredCarousel', 'featuredProducts',
  'countdown', 'video', 'imageText', 'ctaButtons', 'testimonials', 'faq',
  'socialLinks', 'trustBadges', 'newsletter',
];

const BLOCK_LABELS: Record<string, string> = {
  promoBanner: 'Bannière promo',
  hero: 'Bannière principale',
  richText: 'Texte enrichi',
  categories: 'Catégories',
  featuredCarousel: 'Carousel produits',
  featuredProducts: 'Grille produits',
  countdown: 'Countdown',
  video: 'Vidéo',
  imageText: 'Image + Texte',
  ctaButtons: 'Boutons CTA',
  testimonials: 'Témoignages',
  faq: 'FAQ',
  socialLinks: 'Réseaux sociaux',
  trustBadges: 'Badges de confiance',
  newsletter: 'Newsletter',
};

const TYPE_TO_SECTION: Record<string, React.ComponentType> = {
  promoBanner: PromoBannerSection,
  hero: HeroSection,
  richText: RichTextSection,
  categories: CategoriesSection,
  featuredCarousel: FeaturedCollectionCarousel,
  featuredProducts: FeaturedProductsSection,
  countdown: CountdownSection,
  video: VideoSection,
  imageText: ImageTextSection,
  ctaButtons: CtaButtonsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  socialLinks: SocialLinksSection,
  trustBadges: TrustBadgesSection,
  newsletter: NewsletterSection,
};

function isInstanceMode(theme: ThemeConfig): boolean {
  const blocks = theme.blocks;
  const order = theme.sectionOrder;
  if (!blocks || !order?.length) return false;
  const firstId = order[0];
  return firstId in blocks;
}

export function IndexTemplate() {
  const { theme } = useTheme();
  const visibility = theme.sectionVisibility ?? {};
  const isVisible = (id: string) => visibility[id] !== false;

  if (isInstanceMode(theme)) {
    const blocks = theme.blocks!;
    const order = theme.sectionOrder!.filter((id) => blocks[id] && blocks[id].type !== 'logo' && isVisible(id));
    const dragCtx = useEditorCanvasDrag();
    const active = !!dragCtx?.canvasDrag;

    return (
      <>
        {order.map((instanceId, i) => {
          const block = blocks[instanceId];
          if (!block) return null;
          const Section = TYPE_TO_SECTION[block.type];
          if (!Section) return null;
          const overrides = blockDataToThemeOverrides(block, theme);
          return (
            <React.Fragment key={instanceId}>
              <CanvasDropZone
                insertIndex={i}
                active={active}
                onDrop={(idx, blockId, srcIdx) => {
                  window.parent?.postMessage({ type: 'simpshopy-canvas-drop', insertIndex: idx, blockId, sourceIndex: srcIdx }, '*');
                }}
              />
              <BlockWrapper blockId={instanceId} label={BLOCK_LABELS[block.type] ?? block.type} index={i}>
                <BlockThemeProvider overrides={overrides}>
                  <Section />
                </BlockThemeProvider>
              </BlockWrapper>
            </React.Fragment>
          );
        })}
        <CanvasDropZone
          insertIndex={order.length}
          active={active}
          onDrop={(idx, blockId, srcIdx) => {
            window.parent?.postMessage({ type: 'simpshopy-canvas-drop', insertIndex: idx, blockId, sourceIndex: srcIdx }, '*');
          }}
        />
      </>
    );
  }

  const order = theme.sectionOrder ?? DEFAULT_ORDER;
  const sections: { id: string; el: React.ReactNode }[] = [
    { id: 'promoBanner', el: <PromoBannerSection key="promoBanner" /> },
    { id: 'hero', el: <HeroSection key="hero" /> },
    { id: 'richText', el: <RichTextSection key="richText" /> },
    { id: 'categories', el: <CategoriesSection key="categories" /> },
    { id: 'featuredCarousel', el: <FeaturedCollectionCarousel key="featuredCarousel" title={theme.featuredCarouselTitle} /> },
    { id: 'featuredProducts', el: <FeaturedProductsSection key="featuredProducts" limit={theme.featuredProductsLimit} title={theme.featuredProductsTitle} /> },
    { id: 'countdown', el: <CountdownSection key="countdown" /> },
    { id: 'video', el: <VideoSection key="video" /> },
    { id: 'imageText', el: <ImageTextSection key="imageText" /> },
    { id: 'ctaButtons', el: <CtaButtonsSection key="ctaButtons" /> },
    { id: 'testimonials', el: <TestimonialsSection key="testimonials" title={theme.testimonialsTitle} items={theme.testimonialsItems} /> },
    { id: 'faq', el: <FaqSection key="faq" /> },
    { id: 'socialLinks', el: <SocialLinksSection key="socialLinks" /> },
    { id: 'trustBadges', el: <TrustBadgesSection key="trustBadges" /> },
    { id: 'newsletter', el: <NewsletterSection key="newsletter" /> },
  ];

  const orderIds = new Set(order);
  const ordered = order
    .filter((id) => sections.some((s) => s.id === id))
    .concat(sections.filter((s) => !orderIds.has(s.id)).map((s) => s.id));
  const visibleOrdered = ordered.filter((id) => isVisible(id));
  const dragCtx = useEditorCanvasDrag();
  const active = !!dragCtx?.canvasDrag;

  return (
    <>
      {visibleOrdered.map((id, i) => {
        const section = sections.find((s) => s.id === id);
        if (!section) return null;
        return (
          <React.Fragment key={`${section.id}-${i}`}>
            <CanvasDropZone
              insertIndex={i}
              active={active}
              onDrop={(idx, blockId, srcIdx) => {
                window.parent?.postMessage({ type: 'simpshopy-canvas-drop', insertIndex: idx, blockId, sourceIndex: srcIdx }, '*');
              }}
            />
            <BlockWrapper blockId={section.id} label={BLOCK_LABELS[section.id] ?? section.id} index={i}>
              {section.el}
            </BlockWrapper>
          </React.Fragment>
        );
      })}
      <CanvasDropZone
        insertIndex={visibleOrdered.length}
        active={active}
        onDrop={(idx, blockId, srcIdx) => {
          window.parent?.postMessage({ type: 'simpshopy-canvas-drop', insertIndex: idx, blockId, sourceIndex: srcIdx }, '*');
        }}
      />
    </>
  );
}
