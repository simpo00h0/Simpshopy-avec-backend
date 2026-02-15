const STOREFRONT_BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';

export function getEditorIframeSrc(slug: string, templatePath: string): string {
  if (!slug) return '';
  return `${STOREFRONT_BASE}/s/${slug}${templatePath}?editor=1`;
}

export function getStorefrontOrigin(): string {
  try {
    return new URL(STOREFRONT_BASE).origin;
  } catch {
    return '';
  }
}
