export interface MockProduct {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  imagePlaceholder: string; // fallback emoji
  imageUrl?: string; // Unsplash or other free image URL
  category?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  niche: string;
  storeName: string;
  logo?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string; // Unsplash banner image URL
  heroCta?: string;
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
  collections?: { id: string; name: string; productIds: string[] }[];
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
  separatorSection?: { style: 'line' | 'space' | 'dotted' | 'dashed'; thickness?: number; color?: string };
  countdownSection?: { endDate: string; label?: string };
  ctaButtons?: { primaryText: string; primaryHref: string; secondaryText?: string; secondaryHref?: string };
  faqSection?: { title?: string; items: { question: string; answer: string }[] };
  socialLinks?: { facebook?: string; instagram?: string; whatsapp?: string; twitter?: string };
  trustBadges?: { items: { icon?: string; text: string }[] };
  heroAlignment?: 'left' | 'center' | 'right';
  heroHeight?: 'small' | 'medium' | 'large';
  sectionOrder?: string[];
  sectionVisibility?: Record<string, boolean>;
}

export const themesData: Record<string, ThemeConfig> = {
  classique: {
    id: 'classique',
    name: 'Classique',
    niche: 'Polyvalent',
    storeName: 'Ma Boutique',
    heroTitle: 'Bienvenue dans notre boutique',
    heroSubtitle: 'Découvrez une sélection soignée de produits de qualité',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    heroCta: 'Voir les produits',
    richTextHeading: 'À propos de nous',
    richTextContent: 'Nous sélectionnons avec soin des produits de qualité pour vous. Que vous cherchiez un cadeau ou un essentiel du quotidien, vous trouverez ici ce qu\'il vous faut.',
    aboutTitle: 'Pourquoi nous choisir ?',
    aboutContent: 'Qualité garantie, livraison rapide et service client réactif. Votre satisfaction est notre priorité.',
    promoBanner: 'Livraison gratuite dès 25 000 XOF — Zone CFA',
    newsletterTitle: 'Restez informé de nos offres',
    contactEmail: 'contact@maboutique.com',
    contactPhone: '+221 33 XXX XX XX',
    colors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', bg: '#f8f9fa', text: '#212529' },
    products: [
      { id: '1', name: 'Produit Premium', price: 15000, priceLabel: '15 000 XOF', description: 'Qualité supérieure', imagePlaceholder: '📦', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { id: '2', name: 'Essentiel du quotidien', price: 8500, priceLabel: '8 500 XOF', description: 'Indispensable', imagePlaceholder: '✨', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { id: '3', name: 'Cadeau idéal', price: 25000, priceLabel: '25 000 XOF', description: 'Pour toutes les occasions', imagePlaceholder: '🎁', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
      { id: '4', name: 'Best-seller', price: 12000, priceLabel: '12 000 XOF', description: 'Le préféré de nos clients', imagePlaceholder: '⭐', imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80' },
      { id: '5', name: 'Nouvelle arrivée', price: 18000, priceLabel: '18 000 XOF', description: 'Tout juste arrivé', imagePlaceholder: '🆕', imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80' },
      { id: '6', name: 'Promo spéciale', price: 9990, priceLabel: '9 990 XOF', description: 'Offre limitée', imagePlaceholder: '🔥', imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80' },
    ],
    footerTagline: '© Ma Boutique — Tous droits réservés',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Tous les produits', productIds: ['1', '2', '3', '4', '5', '6'] },
      { id: 'best', name: 'Best-sellers', productIds: ['4', '1', '3'] },
    ],
  },
  mode: {
    id: 'mode',
    name: 'Mode',
    niche: 'Vêtements & Accessoires',
    storeName: 'Style Africain',
    heroTitle: 'L\'élégance à portée de main',
    heroSubtitle: 'Collections tendance pour femmes et hommes',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    heroCta: 'Découvrir la collection',
    richTextHeading: 'Notre univers',
    richTextContent: 'Des vêtements et accessoires qui célèbrent la mode africaine. Des créations authentiques et modernes pour vous démarquer.',
    aboutTitle: 'Fait main & authentique',
    aboutContent: 'Chaque pièce est soigneusement sélectionnée. Des artisans locaux aux tissus premium.',
    promoBanner: 'Nouvelle collection printemps — -20% sur une sélection',
    newsletterTitle: 'Accédez en avant-première aux nouveautés',
    contactEmail: 'style@styleafricain.com',
    contactPhone: '+225 07 XX XX XX XX',
    colors: { primary: '#2d132c', secondary: '#801336', accent: '#c72c41', bg: '#faf5f6', text: '#2d132c' },
    products: [
      { id: '1', name: 'Robe wax imprimé', price: 25000, priceLabel: '25 000 XOF', description: 'Tissu premium', imagePlaceholder: '👗', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
      { id: '2', name: 'Sac à main cuir', price: 35000, priceLabel: '35 000 XOF', description: 'Fait main', imagePlaceholder: '👜', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
      { id: '3', name: 'Boubou brodé', price: 45000, priceLabel: '45 000 XOF', description: 'Pièce unique', imagePlaceholder: '👘', imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80' },
      { id: '4', name: 'Sandalettes', price: 15000, priceLabel: '15 000 XOF', description: 'Confortables', imagePlaceholder: '👡', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' },
      { id: '5', name: 'Pagne assorti', price: 12000, priceLabel: '12 000 XOF', description: 'Coton africain', imagePlaceholder: '🧣', imageUrl: 'https://images.unsplash.com/photo-1558171813-63a45d37e129?w=600&q=80' },
      { id: '6', name: 'Bijoux traditionnels', price: 8000, priceLabel: '8 000 XOF', description: 'Artisanat local', imagePlaceholder: '📿', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80' },
    ],
    footerTagline: 'Style Africain — Mode & Tradition',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Collections', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Toute la collection', productIds: ['1', '2', '3', '4', '5', '6'] },
      { id: 'vetements', name: 'Vêtements', productIds: ['1', '3', '5'] },
      { id: 'accessoires', name: 'Accessoires', productIds: ['2', '4', '6'] },
    ],
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    niche: 'Électronique & Gadgets',
    storeName: 'TechZone CFA',
    heroTitle: 'La technologie à petits prix',
    heroSubtitle: 'Smartphones, accessoires et gadgets pour rester connecté',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    heroCta: 'Explorer le catalogue',
    richTextHeading: 'Connectez-vous',
    richTextContent: 'Une sélection de produits tech adaptés au marché africain. Smartphones, accessoires et gadgets à prix compétitifs.',
    aboutTitle: 'Garantie et SAV',
    aboutContent: 'Tous nos produits sont garantis. Service après-vente réactif dans toute la Zone CFA.',
    promoBanner: 'Paiement en 3x sans frais — Livraison express disponible',
    newsletterTitle: 'Offres tech et bons plans',
    contactEmail: 'support@techzonecfa.com',
    contactPhone: '+228 90 XX XX XX',
    colors: { primary: '#0d1b2a', secondary: '#1b263b', accent: '#00b4d8', bg: '#0d1b2a', text: '#e0e0e0' },
    products: [
      { id: '1', name: 'Smartphone 4G', price: 75000, priceLabel: '75 000 XOF', description: 'Double SIM', imagePlaceholder: '📱', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
      { id: '2', name: 'Écouteurs Bluetooth', price: 12000, priceLabel: '12 000 XOF', description: 'Qualité audio HD', imagePlaceholder: '🎧', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { id: '3', name: 'Power bank 20000mAh', price: 18000, priceLabel: '18 000 XOF', description: 'Charge rapide', imagePlaceholder: '🔋', imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80' },
      { id: '4', name: 'Montre connectée', price: 25000, priceLabel: '25 000 XOF', description: 'Suivi santé', imagePlaceholder: '⌚', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { id: '5', name: 'Clavier sans fil', price: 15000, priceLabel: '15 000 XOF', description: 'Ergonomique', imagePlaceholder: '⌨️', imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80' },
      { id: '6', name: 'Chargeur multi-port', price: 8500, priceLabel: '8 500 XOF', description: '3 ports USB', imagePlaceholder: '🔌', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80' },
    ],
    footerTagline: 'TechZone CFA — Connectez-vous à l\'essentiel',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Tous les produits', productIds: ['1', '2', '3', '4', '5', '6'] },
      { id: 'telephonie', name: 'Téléphonie', productIds: ['1', '2'] },
      { id: 'accessoires', name: 'Accessoires', productIds: ['3', '4', '5', '6'] },
    ],
  },
  food: {
    id: 'food',
    name: 'Saveurs',
    niche: 'Alimentation & Restauration',
    storeName: 'Saveurs d\'Afrique',
    heroTitle: 'Les saveurs authentiques',
    heroSubtitle: 'Produits locaux, bio et du terroir',
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    heroCta: 'Découvrir les saveurs',
    richTextHeading: 'Du producteur à votre table',
    richTextContent: 'Nous travaillons directement avec les producteurs locaux pour vous offrir des produits frais, bio et authentiques.',
    aboutTitle: '100% local & bio',
    aboutContent: 'Traçabilité garantie. Des producteurs de la Zone CFA à votre cuisine.',
    promoBanner: 'Produits frais — Livraison le jour même à Dakar',
    newsletterTitle: 'Recettes et actualités du terroir',
    contactEmail: 'saveurs@saveursafrique.com',
    contactPhone: '+221 77 XXX XX XX',
    colors: { primary: '#2d5016', secondary: '#7cb342', accent: '#ff8f00', bg: '#f5f5dc', text: '#2d5016' },
    products: [
      { id: '1', name: 'Miel pur local', price: 8000, priceLabel: '8 000 XOF', description: '500g', imagePlaceholder: '🍯', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80' },
      { id: '2', name: 'Café torréfié', price: 12000, priceLabel: '12 000 XOF', description: '1 kg', imagePlaceholder: '☕', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80' },
      { id: '3', name: 'Épices du marché', price: 3500, priceLabel: '3 500 XOF', description: 'Assortiment', imagePlaceholder: '🧂', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a0b857ab8a21?w=600&q=80' },
      { id: '4', name: 'Chocolat artisanal', price: 6000, priceLabel: '6 000 XOF', description: 'Tablette 100g', imagePlaceholder: '🍫', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4d652a52?w=600&q=80' },
      { id: '5', name: 'Fruits secs', price: 4500, priceLabel: '4 500 XOF', description: 'Mélange premium', imagePlaceholder: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80' },
      { id: '6', name: 'Jus naturel', price: 2500, priceLabel: '2 500 XOF', description: '1L frais', imagePlaceholder: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80' },
    ],
    footerTagline: 'Saveurs d\'Afrique — Du producteur à votre table',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Tous les produits', productIds: ['1', '2', '3', '4', '5', '6'] },
      { id: 'boissons', name: 'Boissons', productIds: ['1', '2', '6'] },
      { id: 'gourmandises', name: 'Gourmandises', productIds: ['3', '4', '5'] },
    ],
  },
  beaute: {
    id: 'beaute',
    name: 'Beauté',
    niche: 'Cosmétiques & Soins',
    storeName: 'Beauté Noire',
    heroTitle: 'Prenez soin de vous',
    heroSubtitle: 'Cosmétiques naturels adaptés aux peaux africaines',
    heroImage: 'https://images.unsplash.com/photo-1596462502278-fbfbdc04619d?w=1200&q=80',
    heroCta: 'Voir la gamme',
    richTextHeading: 'Naturellement vous',
    richTextContent: 'Des soins formulés avec des ingrédients naturels africains : karité, huile de coco, beurre de cacao. Pour une beauté authentique.',
    aboutTitle: 'Formules 100% naturelles',
    aboutContent: 'Sans parabènes, sans sulfates. Des produits testés et approuvés.',
    promoBanner: 'Offre découverte — -15% sur votre 1ère commande',
    newsletterTitle: 'Conseils beauté et nouveautés',
    contactEmail: 'beaute@beautenoire.com',
    contactPhone: '+221 78 XXX XX XX',
    colors: { primary: '#4a1942', secondary: '#7b2cbf', accent: '#e0aaff', bg: '#fdf5ff', text: '#4a1942' },
    products: [
      { id: '1', name: 'Crème hydratante karité', price: 12000, priceLabel: '12 000 XOF', description: '100% naturelle', imagePlaceholder: '🧴', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80' },
      { id: '2', name: 'Huile de coco', price: 8500, priceLabel: '8 500 XOF', description: 'Cheveux & corps', imagePlaceholder: '🫒', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80' },
      { id: '3', name: 'Savon noir traditionnel', price: 2500, priceLabel: '2 500 XOF', description: 'Purifiante', imagePlaceholder: '🧼', imageUrl: 'https://images.unsplash.com/photo-1584305574647-0cc949dc0936?w=600&q=80' },
      { id: '4', name: 'Masque capillaire', price: 15000, priceLabel: '15 000 XOF', description: 'Repousse', imagePlaceholder: '💆', imageUrl: 'https://images.unsplash.com/photo-1522338242762-41d2e6728f67?w=600&q=80' },
      { id: '5', name: 'Parfum doux', price: 22000, priceLabel: '22 000 XOF', description: 'Notes florales', imagePlaceholder: '🌸', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80' },
      { id: '6', name: 'Baume à lèvres', price: 3500, priceLabel: '3 500 XOF', description: 'Karité & miel', imagePlaceholder: '💄', imageUrl: 'https://images.unsplash.com/photo-1631214524026-68e6197382bd?w=600&q=80' },
    ],
    footerTagline: 'Beauté Noire — Naturellement vous',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Toute la gamme', productIds: ['1', '2', '3', '4', '5', '6'] },
    ],
  },
  artisanat: {
    id: 'artisanat',
    name: 'Artisanat',
    niche: 'Créations & Handmade',
    storeName: 'Créations Artisanales',
    heroTitle: 'L\'art de la main',
    heroSubtitle: 'Pièces uniques créées par des artisans locaux',
    heroImage: 'https://images.unsplash.com/photo-1582735689369-22fe6a2b488c?w=1200&q=80',
    heroCta: 'Découvrir les créations',
    richTextHeading: 'Fait avec amour',
    richTextContent: 'Chaque pièce est unique. Sculptures, poteries, textiles — créés par des artisans de la Zone CFA.',
    aboutTitle: 'Artisans partenaires',
    aboutContent: 'Nous soutenons les créateurs locaux. Chaque achat valorise leur savoir-faire.',
    promoBanner: 'Pièces uniques — Chaque création est signée par l\'artisan',
    newsletterTitle: 'Ateliers et créations exclusives',
    contactEmail: 'contact@creations-artisanales.com',
    contactPhone: '+228 90 XX XX XX',
    colors: { primary: '#3e2723', secondary: '#5d4037', accent: '#8d6e63', bg: '#efebe9', text: '#3e2723' },
    products: [
      { id: '1', name: 'Sculpture en bois', price: 35000, priceLabel: '35 000 XOF', description: 'Pièce unique', imagePlaceholder: '🪵', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80' },
      { id: '2', name: 'Panier tressé', price: 12000, priceLabel: '12 000 XOF', description: 'Fait main', imagePlaceholder: '🧺', imageUrl: 'https://images.unsplash.com/photo-1602874801006-4e6e9c7e0a78?w=600&q=80' },
      { id: '3', name: 'Bougie décorative', price: 5500, priceLabel: '5 500 XOF', description: 'Parfum naturel', imagePlaceholder: '🕯️', imageUrl: 'https://images.unsplash.com/photo-1602874801006-4e6e9c7e0a78?w=600&q=80' },
      { id: '4', name: 'Poterie traditionnelle', price: 18000, priceLabel: '18 000 XOF', description: 'Cuit au feu', imagePlaceholder: '🏺', imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80' },
      { id: '5', name: 'Tapis tissé', price: 45000, priceLabel: '45 000 XOF', description: 'Couleurs vives', imagePlaceholder: '🎨', imageUrl: 'https://images.unsplash.com/photo-1558171813-63a45d37e129?w=600&q=80' },
      { id: '6', name: 'Bracelet cuir', price: 6500, priceLabel: '6 500 XOF', description: 'Artisanat local', imagePlaceholder: '📿', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80' },
    ],
    footerTagline: 'Créations Artisanales — Fait avec amour',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Toutes les créations', productIds: ['1', '2', '3', '4', '5', '6'] },
    ],
  },
  sante: {
    id: 'sante',
    name: 'Bien-être',
    niche: 'Santé & Fitness',
    storeName: 'Vitalité Plus',
    heroTitle: 'Votre santé, notre priorité',
    heroSubtitle: 'Compléments et accessoires fitness',
    heroImage: 'https://images.unsplash.com/photo-1571902940162-29648ad5e73c?w=1200&q=80',
    heroCta: 'Voir les produits',
    richTextHeading: 'Prenez soin de votre corps',
    richTextContent: 'Compléments alimentaires, protéines et accessoires fitness. Tout pour atteindre vos objectifs santé.',
    aboutTitle: 'Qualité & efficacité',
    aboutContent: 'Produits sélectionnés pour leur formulation et leur efficacité prouvée.',
    promoBanner: 'Programme fidélité — Cumulez des points à chaque achat',
    newsletterTitle: 'Conseils sport et nutrition',
    contactEmail: 'vitalite@vitaliteplus.com',
    contactPhone: '+225 05 XX XX XX XX',
    colors: { primary: '#1b4332', secondary: '#2d6a4f', accent: '#52b788', bg: '#f0fff4', text: '#1b4332' },
    products: [
      { id: '1', name: 'Multivitamines', price: 15000, priceLabel: '15 000 XOF', description: '90 gélules', imagePlaceholder: '💊', imageUrl: 'https://images.unsplash.com/photo-1550572017-4870a2f3e2f5?w=600&q=80' },
      { id: '2', name: 'Protéine végétale', price: 28000, priceLabel: '28 000 XOF', description: '1 kg', imagePlaceholder: '🥤', imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80' },
      { id: '3', name: 'Bande de résistance', price: 7500, priceLabel: '7 500 XOF', description: 'Set 3 niveaux', imagePlaceholder: '🏋️', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80' },
      { id: '4', name: 'Huile de nigelle', price: 12000, priceLabel: '12 000 XOF', description: '250ml', imagePlaceholder: '🫙', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80' },
      { id: '5', name: 'Tapis de yoga', price: 18000, priceLabel: '18 000 XOF', description: 'Épais 6mm', imagePlaceholder: '🧘', imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80' },
      { id: '6', name: 'Shaker sport', price: 4500, priceLabel: '4 500 XOF', description: '700ml', imagePlaceholder: '🫗', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
    ],
    footerTagline: 'Vitalité Plus — Bougez, vivez mieux',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Tous les produits', productIds: ['1', '2', '3', '4', '5', '6'] },
    ],
  },
  luxe: {
    id: 'luxe',
    name: 'Luxe',
    niche: 'Haut de gamme',
    storeName: 'L\'Exclusif',
    heroTitle: 'L\'excellence réinventée',
    heroSubtitle: 'Sélection premium pour une clientèle exigeante',
    heroImage: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80',
    heroCta: 'Découvrir la collection',
    richTextHeading: 'L\'art du raffinement',
    richTextContent: 'Des pièces d\'exception soigneusement sélectionnées. Montres, accessoires et parfums de luxe.',
    aboutTitle: 'Authenticité garantie',
    aboutContent: 'Chaque article est authentifié. Emballage premium et livraison soignée.',
    promoBanner: 'Emballage cadeau offert — Pour toute commande supérieure à 100 000 XOF',
    newsletterTitle: 'Accès VIP aux collections privées',
    contactEmail: 'contact@lexclusif.com',
    contactPhone: '+221 33 XXX XX XX',
    colors: { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#c9a227', bg: '#0d0d0d', text: '#e5e5e5' },
    products: [
      { id: '1', name: 'Montre or rose', price: 250000, priceLabel: '250 000 XOF', description: 'Édition limitée', imagePlaceholder: '⌚', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { id: '2', name: 'Écharpe soie', price: 85000, priceLabel: '85 000 XOF', description: 'Fabrication italienne', imagePlaceholder: '🧣', imageUrl: 'https://images.unsplash.com/photo-1558171813-63a45d37e129?w=600&q=80' },
      { id: '3', name: 'Parfum signature', price: 95000, priceLabel: '95 000 XOF', description: '100ml', imagePlaceholder: '🌸', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80' },
      { id: '4', name: 'Portefeuille cuir', price: 65000, priceLabel: '65 000 XOF', description: 'Cuir pleine fleur', imagePlaceholder: '👛', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80' },
      { id: '5', name: 'Lunettes soleil', price: 120000, priceLabel: '120 000 XOF', description: 'Designer', imagePlaceholder: '🕶️', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80' },
      { id: '6', name: 'Stylo plume', price: 75000, priceLabel: '75 000 XOF', description: 'Or 18 carats', imagePlaceholder: '🖊️', imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80' },
    ],
    footerTagline: 'L\'Exclusif — Où le luxe rencontre l\'élégance',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'La collection', productIds: ['1', '2', '3', '4', '5', '6'] },
    ],
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    niche: 'Design épuré',
    storeName: 'Essentiel',
    heroTitle: 'Moins, c\'est plus',
    heroSubtitle: 'Des produits essentiels, présentés simplement',
    heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    heroCta: 'Voir les produits',
    richTextHeading: 'Simplicité volontaire',
    richTextContent: 'Nous proposons des produits soigneusement sélectionnés. Pas de superflu, que l\'essentiel.',
    aboutTitle: 'Transparence totale',
    aboutContent: 'Des produits honnêtes. Des prix clairs. Une expérience épurée.',
    promoBanner: 'Livraison offerte — Dès 15 000 XOF',
    newsletterTitle: 'L\'essentiel, rien de plus',
    contactEmail: 'hello@essentiel.com',
    contactPhone: '+221 70 XXX XX XX',
    colors: { primary: '#212529', secondary: '#495057', accent: '#212529', bg: '#ffffff', text: '#212529' },
    products: [
      { id: '1', name: 'Produit A', price: 12000, priceLabel: '12 000 XOF', description: 'Simple et efficace', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { id: '2', name: 'Produit B', price: 18500, priceLabel: '18 500 XOF', description: 'Design épuré', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { id: '3', name: 'Produit C', price: 9500, priceLabel: '9 500 XOF', description: 'Qualité pure', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80' },
      { id: '4', name: 'Produit D', price: 22000, priceLabel: '22 000 XOF', description: 'Sans superflu', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80' },
      { id: '5', name: 'Produit E', price: 15000, priceLabel: '15 000 XOF', description: 'L\'essentiel', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80' },
      { id: '6', name: 'Produit F', price: 11000, priceLabel: '11 000 XOF', description: 'Minimaliste', imagePlaceholder: '·', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
    ],
    footerTagline: 'Essentiel — Simplicité volontaire',
    footerLinks: [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    collections: [
      { id: 'all', name: 'Tous', productIds: ['1', '2', '3', '4', '5', '6'] },
    ],
  },
};
