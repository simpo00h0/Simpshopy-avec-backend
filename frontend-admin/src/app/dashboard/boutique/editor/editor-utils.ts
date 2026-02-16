import { getStoreUrl } from '@/lib/storefront-url';

export function getEditorIframeSrc(subdomain: string, templatePath: string): string {
  if (!subdomain) return '';
  return `${getStoreUrl(subdomain)}${templatePath}?editor=1`;
}

export function getStorefrontOrigin(iframeSrc: string): string {
  try {
    return iframeSrc ? new URL(iframeSrc).origin : '';
  } catch {
    return '';
  }
}
