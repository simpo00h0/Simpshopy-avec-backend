'use client';

import type { BlockId } from '../../editor-types';
import type { BlockSettingsProps } from '../../editor-types';
import { BlockAboutSettings } from './BlockAboutSettings';
import { BlockCategoriesSettings } from './BlockCategoriesSettings';
import { BlockColorsSettings } from './BlockColorsSettings';
import { BlockContactSettings } from './BlockContactSettings';
import { BlockCountdownSettings } from './BlockCountdownSettings';
import { BlockCtaButtonsSettings } from './BlockCtaButtonsSettings';
import { BlockFaqSettings } from './BlockFaqSettings';
import { BlockFeaturedCarouselSettings } from './BlockFeaturedCarouselSettings';
import { BlockFeaturedProductsSettings } from './BlockFeaturedProductsSettings';
import { BlockFooterSettings } from './BlockFooterSettings';
import { BlockHeaderSettings } from './BlockHeaderSettings';
import { BlockHeroSettings } from './BlockHeroSettings';
import { BlockImageTextSettings } from './BlockImageTextSettings';
import { BlockNewsletterSettings } from './BlockNewsletterSettings';
import { BlockPromoBannerSettings } from './BlockPromoBannerSettings';
import { BlockRichTextSettings } from './BlockRichTextSettings';
import { BlockSeparatorSettings } from './BlockSeparatorSettings';
import { BlockSocialLinksSettings } from './BlockSocialLinksSettings';
import { BlockTestimonialsSettings } from './BlockTestimonialsSettings';
import { BlockTrustBadgesSettings } from './BlockTrustBadgesSettings';
import { BlockVideoSettings } from './BlockVideoSettings';

const BLOCK_SETTINGS_MAP: Partial<Record<BlockId, React.ComponentType<BlockSettingsProps>>> = {
  header: BlockHeaderSettings,
  promoBanner: BlockPromoBannerSettings,
  hero: BlockHeroSettings,
  richText: BlockRichTextSettings,
  featuredCarousel: BlockFeaturedCarouselSettings,
  featuredProducts: BlockFeaturedProductsSettings,
  testimonials: BlockTestimonialsSettings,
  newsletter: BlockNewsletterSettings,
  footer: BlockFooterSettings,
  colors: BlockColorsSettings,
  contact: BlockContactSettings,
  about: BlockAboutSettings,
  categories: BlockCategoriesSettings,
  video: BlockVideoSettings,
  imageText: BlockImageTextSettings,
  separator: BlockSeparatorSettings,
  countdown: BlockCountdownSettings,
  ctaButtons: BlockCtaButtonsSettings,
  faq: BlockFaqSettings,
  socialLinks: BlockSocialLinksSettings,
  trustBadges: BlockTrustBadgesSettings,
};

interface BlockSettingsDispatchProps extends BlockSettingsProps {
  selectedBlock: BlockId;
}

export function BlockSettings({ selectedBlock, customization, update, updateNested }: BlockSettingsDispatchProps) {
  const Component = BLOCK_SETTINGS_MAP[selectedBlock];
  return Component ? <Component customization={customization} update={update} updateNested={updateNested} /> : null;
}
