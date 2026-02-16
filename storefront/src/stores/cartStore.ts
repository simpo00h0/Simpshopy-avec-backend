import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockProduct } from '@/themes/theme-types';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  priceLabel: string;
  imageUrl?: string;
  imagePlaceholder: string;
  quantity: number;
  storeSlug: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: MockProduct, quantity: number, storeSlug: string) => void;
  removeItem: (productId: string, storeSlug: string) => void;
  updateQuantity: (productId: string, quantity: number, storeSlug: string) => void;
  clear: (storeSlug: string) => void;
  getItems: (storeSlug: string) => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, storeSlug) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.storeSlug === storeSlug
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.storeSlug === storeSlug
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                priceLabel: product.priceLabel,
                imageUrl: product.imageUrl,
                imagePlaceholder: product.imagePlaceholder,
                quantity,
                storeSlug,
              },
            ],
          };
        });
      },
      removeItem: (productId, storeSlug) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.storeSlug === storeSlug)
          ),
        }));
      },
      updateQuantity: (productId, quantity, storeSlug) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeSlug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.storeSlug === storeSlug
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clear: (storeSlug) => {
        set((state) => ({
          items: state.items.filter((i) => i.storeSlug !== storeSlug),
        }));
      },
      getItems: (storeSlug) =>
        get().items.filter((i) => i.storeSlug === storeSlug),
    }),
    { name: 'simpshopy-cart' }
  )
);
