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
  storeSubdomain: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: MockProduct, quantity: number, storeSubdomain: string) => void;
  removeItem: (productId: string, storeSubdomain: string) => void;
  updateQuantity: (productId: string, quantity: number, storeSubdomain: string) => void;
  clear: (storeSubdomain: string) => void;
  getItems: (storeSubdomain: string) => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, storeSubdomain) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.storeSubdomain === storeSubdomain
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.storeSubdomain === storeSubdomain
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
                storeSubdomain,
              },
            ],
          };
        });
      },
      removeItem: (productId, storeSubdomain) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.storeSubdomain === storeSubdomain)
          ),
        }));
      },
      updateQuantity: (productId, quantity, storeSubdomain) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeSubdomain);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.storeSubdomain === storeSubdomain
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clear: (storeSubdomain) => {
        set((state) => ({
          items: state.items.filter((i) => i.storeSubdomain !== storeSubdomain),
        }));
      },
      getItems: (storeSubdomain) =>
        get().items.filter((i) => i.storeSubdomain === storeSubdomain),
    }),
    { name: 'simpshopy-cart' }
  )
);
