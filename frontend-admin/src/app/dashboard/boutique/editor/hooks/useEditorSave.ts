'use client';

import { useState, useCallback, useRef } from 'react';
import { useStoreStore, type ThemeCustomization, type Store } from '@/stores/storeStore';
import type { IStoreSettingsRepository } from '../domain/store-settings.port';
import { defaultStoreSettingsRepository } from '../infrastructure/store-settings.repository';

export function useEditorSave(
  customization: ThemeCustomization,
  currentStore: Store | null,
  storeSettingsRepository: IStoreSettingsRepository = defaultStoreSettingsRepository
) {
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSavedRef = useRef<string>('');

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!currentStore?.id) return false;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await storeSettingsRepository.saveThemeCustomization(currentStore.id, customization);
      if (updated) setCurrentStore(updated as Store);
      setSaved(true);
      lastSavedRef.current = JSON.stringify(customization);
      setTimeout(() => setSaved(false), 2000);
      return true;
    } catch {
      setSaved(false);
      return false;
    } finally {
      setSaving(false);
    }
  }, [currentStore, customization, setCurrentStore, storeSettingsRepository]);

  const hasUnsavedChanges =
    lastSavedRef.current !== '' && JSON.stringify(customization) !== lastSavedRef.current;

  return { handleSave, saving, saved, lastSavedRef, hasUnsavedChanges };
}
