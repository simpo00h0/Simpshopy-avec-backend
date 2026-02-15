'use client';

import { useEffect } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import { api } from '@/lib/api';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { DEFAULT_SECTION_ORDER } from '../editor-constants';

interface UseEditorLoadParams {
  storeId: string | null;
  slug: string;
  setCustomization: (c: ThemeCustomization | ((prev: ThemeCustomization) => ThemeCustomization)) => void;
  setHistory: (h: ThemeCustomization[] | ((prev: ThemeCustomization[]) => ThemeCustomization[])) => void;
  setHistoryIndex: (i: number) => void;
  lastSavedRef: React.MutableRefObject<string>;
}

export function useEditorLoad(params: UseEditorLoadParams): void {
  const { storeId, slug, setCustomization, setHistory, setHistoryIndex, lastSavedRef } = params;
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);

  useEffect(() => {
    if (!storeId || !slug) return;

    const load = async (): Promise<void> => {
      try {
        const { data } = await api.get<{
          id: string;
          name: string;
          slug: string;
          settings?: { themeCustomization?: ThemeCustomization | null } | null;
        }>(`/stores/${storeId}`);

        const cust: ThemeCustomization =
          (data.settings?.themeCustomization as ThemeCustomization) ?? {};

        if (data) setCurrentStore(data as Store);

        setCustomization(cust);
        setHistory([cust]);
        setHistoryIndex(0);
        lastSavedRef.current = JSON.stringify(cust);
      } catch {
        const empty: ThemeCustomization = { sectionOrder: [...DEFAULT_SECTION_ORDER] };
        setCustomization(empty);
        setHistory([empty]);
        setHistoryIndex(0);
        lastSavedRef.current = JSON.stringify(empty);
      }
    };

    load();
  }, [storeId, slug, setCustomization, setHistory, setHistoryIndex, lastSavedRef, setCurrentStore]);
}
