import type { ThemeCustomization, BlocksMap } from '@simpshopy/shared';
import { DEFAULT_SECTION_ORDER } from './editor-constants';

const BLOCK_TYPE_IDS = new Set(DEFAULT_SECTION_ORDER);

function genId(): string {
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Détecte si la personnalisation utilise l'ancien format (sectionOrder avec types) */
function isLegacyFormat(cust: ThemeCustomization): boolean {
  if (!cust.sectionOrder?.length) return true;
  const first = cust.sectionOrder[0];
  return BLOCK_TYPE_IDS.has(first) && !first.startsWith('b-');
}

/** Migre l'ancien format vers blocks + sectionOrder (IDs instance) */
export function migrateToBlockInstances(cust: ThemeCustomization): ThemeCustomization {
  if (cust.blocks && Object.keys(cust.blocks).length > 0) return cust;
  if (!isLegacyFormat(cust)) return cust;

  const order = cust.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const blocks: BlocksMap = {};
  const newOrder: string[] = [];

  for (let i = 0; i < order.length; i++) {
    const typeId = order[i];
    if (!BLOCK_TYPE_IDS.has(typeId)) continue;

    const instanceId = genId();
    const data = getLegacyBlockData(typeId, cust);
    blocks[instanceId] = { type: typeId, data };
    newOrder.push(instanceId);
  }

  const { blocks: _b, sectionOrder: _s, ...rest } = cust;
  return {
    ...rest,
    blocks,
    sectionOrder: newOrder.length > 0 ? newOrder : undefined,
  };
}

function getLegacyBlockData(typeId: string, cust: ThemeCustomization): Record<string, unknown> {
  switch (typeId) {
    case 'hero': {
      const h = (cust.hero as Record<string, unknown>) ?? {};
      return {
        ...h,
        heroAlignment: cust.heroAlignment ?? h.heroAlignment,
        heroHeight: cust.heroHeight ?? h.heroHeight,
      };
    }
    case 'promoBanner':
      return { text: cust.promoBanner ?? '' };
    case 'richText':
      return (cust.richText as Record<string, unknown>) ?? {};
    case 'categories':
      return (cust.categories as Record<string, unknown>) ?? {};
    case 'featuredCarousel':
      return (cust.featuredCarousel as Record<string, unknown>) ?? {};
    case 'featuredProducts':
      return (cust.featuredProducts as Record<string, unknown>) ?? {};
    case 'countdown':
      return (cust.countdown as Record<string, unknown>) ?? {};
    case 'video':
      return (cust.video as Record<string, unknown>) ?? {};
    case 'imageText':
      return (cust.imageText as Record<string, unknown>) ?? {};
    case 'separator':
      return (cust.separator as Record<string, unknown>) ?? {};
    case 'ctaButtons':
      return (cust.ctaButtons as Record<string, unknown>) ?? {};
    case 'testimonials':
      return (cust.testimonials as Record<string, unknown>) ?? {};
    case 'faq':
      return (cust.faq as Record<string, unknown>) ?? {};
    case 'socialLinks':
      return (cust.socialLinks as Record<string, unknown>) ?? {};
    case 'trustBadges':
      return (cust.trustBadges as Record<string, unknown>) ?? {};
    case 'newsletter':
      return { title: cust.newsletterTitle ?? '' };
    default:
      return {};
  }
}
