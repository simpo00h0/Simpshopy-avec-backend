'use client';

import { useEffect } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { DEFAULT_SECTION_ORDER } from '../editor-constants';
import { migrateToBlockInstances } from '../editor-migration';
import type { IStoreSettingsRepository } from '../domain/store-settings.port';
import { defaultStoreSettingsRepository } from '../infrastructure/store-settings.repository';

interface UseEditorLoadParams {
  storeId: string | null;
  subdomain: string;
  setCustomization: (c: ThemeCustomization | ((prev: ThemeCustomization) => ThemeCustomization)) => void;
  setHistory: (h: ThemeCustomization[] | ((prev: ThemeCustomization[]) => ThemeCustomization[])) => void;
  setHistoryIndex: (i: number) => void;
  lastSavedRef: React.MutableRefObject<string>;
  setDirty?: (dirty: boolean) => void;
  clearDirtyTracking?: () => void;
  storeSettingsRepository?: IStoreSettingsRepository;
}

export function useEditorLoad(params: UseEditorLoadParams): void {
  const {
    storeId,
    subdomain,
    setCustomization,
    setHistory,
    setHistoryIndex,
    lastSavedRef,
    setDirty,
    clearDirtyTracking,
    storeSettingsRepository = defaultStoreSettingsRepository,
  } = params;
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);

  useEffect(() => {
    if (!storeId) return;

    const load = async (): Promise<void> => {
      try {
        const store = await storeSettingsRepository.getStoreWithTheme(storeId);
        const raw: ThemeCustomization =
          (store.settings?.themeCustomization as ThemeCustomization) ?? {};
        const cust = migrateToBlockInstances(raw);

        setCurrentStore(store as Store);
        setCustomization(cust);
        setHistory([cust]);
        setHistoryIndex(0);
        lastSavedRef.current = JSON.stringify(cust);
        setDirty?.(false);
        clearDirtyTracking?.();
      } catch {
        const empty = migrateToBlockInstances({ sectionOrder: [...DEFAULT_SECTION_ORDER] });
        setCustomization(empty);
        setHistory([empty]);
        setHistoryIndex(0);
        lastSavedRef.current = JSON.stringify(empty);
        setDirty?.(false);
        clearDirtyTracking?.();
      }
    };

    load();
  }, [storeId, setCustomization, setHistory, setHistoryIndex, lastSavedRef, setDirty, clearDirtyTracking, setCurrentStore, storeSettingsRepository]);
}
