import { create } from 'zustand';
import type { ThemeCustomization } from '@simpshopy/shared';

export type { ThemeCustomization };

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  status: string;
  settings?: {
    themeId?: string | null;
    themeCustomization?: ThemeCustomization | null;
  } | null;
}

interface StoreState {
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  currentStore: null,
  setCurrentStore: (store) => set({ currentStore: store }),
}));
