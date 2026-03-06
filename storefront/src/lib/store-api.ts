import { API_BASE_URL } from './constants';

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
}

export interface StoreCollection {
  id: string;
  slug: string;
  name: string;
  productIds: string[];
}

export interface StorePublic {
  id: string;
  name: string;
  subdomain: string;
  description?: string | null;
  logo?: string | null;
  products: StoreProduct[];
  collections?: StoreCollection[];
}

export async function fetchStore(subdomain: string): Promise<StorePublic | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/storefront/${subdomain}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storefront] Erreur chargement boutique:', err);
    }
    return null;
  }
}
