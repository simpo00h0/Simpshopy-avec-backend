'use client';

import { useEffect } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { DEFAULT_SECTION_ORDER } from '../editor-constants';
import type { IStoreSettingsRepository } from '../domain/store-settings.port';
import { defaultStoreSettingsRepository } from '../infrastructure/store-settings.repository';

interface UseEditorLoadParams {
  storeId: string | null;
  slug: string;
  setCustomization: (c: ThemeCustomization | ((prev: ThemeCustomization) => ThemeCustomization)) => void;
  setHistory: (h: ThemeCustomization[] | ((prev: ThemeCustomization[]) => ThemeCustomization[])) => void;
  setHistoryIndex: (i: number) => void;
  lastSavedRef: React.MutableRefObject<string>;
  storeSettingsRepository?: IStoreSettingsRepository;
}

export function useEditorLoad(params: UseEditorLoadParams): void {
  const {
    storeId,
    slug,
    setCustomization,
    setHistory,
    setHistoryIndex,
    lastSavedRef,
    storeSettingsRepository = defaultStoreSettingsRepository,
  } = params;
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);

  useEffect(() => {
    if (!storeId || !slug) return;

    const load = async (): Promise<void> => {
      try {
        const store = await storeSettingsRepository.getStoreWithTheme(storeId);
        const cust: ThemeCustomization =
          (store.settings?.themeCustomization as ThemeCustomization) ?? {};

        setCurrentStore(store as Store);
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
  }, [storeId, slug, setCustomization, setHistory, setHistoryIndex, lastSavedRef, setCurrentStore, storeSettingsRepository]);
}
