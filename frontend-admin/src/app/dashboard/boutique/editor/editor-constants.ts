export const SIMPSHOPY_EDITOR_EVENT = 'simpshopy-block-select';
export const SIMPSHOPY_BLOCK_DELETE = 'simpshopy-block-delete';
export const SIMPSHOPY_THEME_UPDATE = 'simpshopy-theme-update';
export const SIMPSHOPY_SCROLL_TO_BLOCK = 'simpshopy-scroll-to-block';
export const SIMPSHOPY_SELECTED_BLOCK = 'simpshopy-selected-block';
export const EDITOR_CACHED_KEY = 'simpshopy-editor-cached';
export const CANVAS_SOURCE_INDEX_KEY = 'application/x-simpshopy-source-index';
export const DRAG_SOURCE_LIBRARY = 'library';
export const DRAG_SOURCE_CANVAS = 'canvas';
export const LEAVE_FADE_MS = 180;

export const DEFAULT_SECTION_ORDER = [
  'promoBanner', 'hero', 'richText', 'categories', 'featuredCarousel', 'featuredProducts',
  'countdown', 'video', 'imageText', 'separator', 'ctaButtons', 'testimonials', 'faq',
  'socialLinks', 'trustBadges', 'newsletter',
];

export const HOME_BLOCKS = [
  { id: 'header', label: 'En-tête & logo', template: 'all', category: 'header' as const },
  { id: 'promoBanner', label: 'Bannière promo', template: 'home', category: 'content' as const },
  { id: 'hero', label: 'Bannière principale', template: 'home', category: 'content' as const },
  { id: 'richText', label: 'Texte enrichi', template: 'home', category: 'content' as const },
  { id: 'categories', label: 'Catégories', template: 'home', category: 'content' as const },
  { id: 'featuredCarousel', label: 'Carousel produits', template: 'home', category: 'content' as const },
  { id: 'featuredProducts', label: 'Grille produits', template: 'home', category: 'content' as const },
  { id: 'countdown', label: 'Countdown', template: 'home', category: 'content' as const },
  { id: 'video', label: 'Vidéo', template: 'home', category: 'content' as const },
  { id: 'imageText', label: 'Image + Texte', template: 'home', category: 'content' as const },
  { id: 'separator', label: 'Séparateur', template: 'home', category: 'content' as const },
  { id: 'ctaButtons', label: 'Boutons CTA', template: 'home', category: 'content' as const },
  { id: 'testimonials', label: 'Témoignages', template: 'home', category: 'content' as const },
  { id: 'faq', label: 'FAQ', template: 'home', category: 'content' as const },
  { id: 'socialLinks', label: 'Réseaux sociaux', template: 'home', category: 'content' as const },
  { id: 'trustBadges', label: 'Badges de confiance', template: 'home', category: 'content' as const },
  { id: 'newsletter', label: 'Newsletter', template: 'home', category: 'content' as const },
  { id: 'footer', label: 'Pied de page', template: 'all', category: 'footer' as const },
  { id: 'contact', label: 'Contact', template: 'contact', category: 'pages' as const },
  { id: 'about', label: 'Page À propos', template: 'about', category: 'pages' as const },
  { id: 'colors', label: 'Couleurs', template: 'all', category: 'theme' as const },
] as const;

export const HOME_PALETTE = HOME_BLOCKS.filter(
  (b) => b.template === 'home' || b.template === 'all'
);

export const TEMPLATES = [
  { id: 'home', label: 'Accueil', path: '' },
  { id: 'products', label: 'Produits', path: '/collections/all' },
  { id: 'about', label: 'À propos', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
] as const;

export const COLOR_PRESETS: Record<string, { primary: string; secondary: string; accent: string; bg: string; text: string }> = {
  classique: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', bg: '#f8f9fa', text: '#212529' },
  mode: { primary: '#2d132c', secondary: '#801336', accent: '#c72c41', bg: '#faf5f6', text: '#2d132c' },
  tech: { primary: '#0d1b2a', secondary: '#1b263b', accent: '#00b4d8', bg: '#0d1b2a', text: '#e0e0e0' },
  nature: { primary: '#2d5016', secondary: '#7cb342', accent: '#ff8f00', bg: '#f5f5dc', text: '#2d5016' },
  luxe: { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#c9a227', bg: '#0d0d0d', text: '#e5e5e5' },
  minimal: { primary: '#212529', secondary: '#495057', accent: '#212529', bg: '#ffffff', text: '#212529' },
};
