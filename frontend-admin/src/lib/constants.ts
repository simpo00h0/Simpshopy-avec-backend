/** Noms d'affichage des thèmes par ID */
export const THEME_NAMES: Record<string, string> = {
  classique: 'Classique',
  mode: 'Mode',
  tech: 'Tech',
  food: 'Saveurs',
  beaute: 'Beauté',
  artisanat: 'Artisanat',
  sante: 'Bien-être',
  luxe: 'Luxe',
  minimal: 'Minimal',
};

/** Couleurs Mantine pour les statuts de commande */
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'cyan',
  SHIPPED: 'teal',
  DELIVERED: 'green',
  CANCELLED: 'red',
};
