export function getEditorIframeSrc(slug: string, templatePath: string): string {
  if (!slug) return '';
  const base = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';
  return `${base}/s/${slug}${templatePath}?editor=1`;
}
