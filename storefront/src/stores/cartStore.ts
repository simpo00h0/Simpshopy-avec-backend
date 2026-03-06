import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockProduct } from '@/themes/theme-types';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  priceLabel: string;
  imageUrl?: string;
  imagePlaceholder: string;
  quantity: number;
  storeSubdomain: string;
}

function sameLine(
  i: CartItem,
  productId: string,
  storeSubdomain: string,
  variantId?: string
): boolean {
  return (
    i.productId === productId &&
    i.storeSubdomain === storeSubdomain &&
    (i.variantId ?? '') === (variantId ?? '')
  );
}

interface CartState {
  items: CartItem[];
  addItem: (product: MockProduct, quantity: number, storeSubdomain: string, variantId?: string) => void;
  removeItem: (productId: string, storeSubdomain: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, storeSubdomain: string, variantId?: string) => void;
  clear: (storeSubdomain: string) => void;
  getItems: (storeSubdomain: string) => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, storeSubdomain, variantId) => {
        const variant = variantId
          ? product.variants?.find((v) => v.id === variantId)
          : undefined;
        const price = variant?.price ?? product.price;
        const priceLabel = variant ? `${price.toLocaleString('fr-FR')} XOF` : product.priceLabel;
        const imageUrl = variant?.imageUrl ?? product.imageUrl;
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, product.id, storeSubdomain, variantId)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, product.id, storeSubdomain, variantId)
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
                variantId,
                name: product.name,
                price,
                priceLabel,
                imageUrl,
                imagePlaceholder: product.imagePlaceholder,
                quantity,
                storeSubdomain,
              },
            ],
          };
        });
      },
      removeItem: (productId, storeSubdomain, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, storeSubdomain, variantId)
          ),
        }));
      },
      updateQuantity: (productId, quantity, storeSubdomain, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeSubdomain, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, storeSubdomain, variantId) ? { ...i, quantity } : i
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
