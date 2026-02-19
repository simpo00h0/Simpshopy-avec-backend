'use client';

import { useState, useCallback, useRef } from 'react';
import { useStoreStore, type ThemeCustomization, type Store } from '@/stores/storeStore';
import type { IStoreSettingsRepository } from '../domain/store-settings.port';
import { defaultStoreSettingsRepository } from '../infrastructure/store-settings.repository';

export function useEditorSave(
  customization: ThemeCustomization,
  currentStore: Store | null,
  storeSettingsRepository: IStoreSettingsRepository = defaultStoreSettingsRepository,
  setCustomization?: (c: ThemeCustomization | ((prev: ThemeCustomization) => ThemeCustomization)) => void,
  options?: {
    setDirty?: (dirty: boolean) => void;
    isDirty?: boolean;
    getPartialPayload?: (cust: ThemeCustomization) => Partial<ThemeCustomization>;
    hasDirtyTracking?: () => boolean;
    clearDirtyTracking?: () => void;
  }
) {
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSavedRef = useRef<string>('');
  const setDirty = options?.setDirty;
  const isDirty = options?.isDirty;
  const getPartialPayload = options?.getPartialPayload;
  const hasDirtyTracking = options?.hasDirtyTracking;
  const clearDirtyTracking = options?.clearDirtyTracking;

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!currentStore?.id) return false;
    setSaving(true);
    setSaved(false);
    try {
      const usePartial =
        hasDirtyTracking?.() && getPartialPayload && clearDirtyTracking;
      const payload = usePartial
        ? getPartialPayload(customization)
        : customization;
      const isPartial = usePartial && Object.keys(payload).length > 0;

      const updated = await storeSettingsRepository.saveThemeCustomization(
        currentStore.id,
        payload,
        isPartial ? { partial: true } : undefined
      );

      if (updated) {
        setCurrentStore(updated as Store);
        const savedCust = (updated as Store).settings?.themeCustomization ?? customization;
        if (setCustomization) setCustomization(savedCust as ThemeCustomization);
        lastSavedRef.current = JSON.stringify(savedCust);
        setDirty?.(false);
        clearDirtyTracking?.();
      } else {
        lastSavedRef.current = JSON.stringify(customization);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return true;
    } catch {
      setSaved(false);
      return false;
    } finally {
      setSaving(false);
    }
  }, [
    currentStore,
    customization,
    setCurrentStore,
    setCustomization,
    setDirty,
    storeSettingsRepository,
    getPartialPayload,
    hasDirtyTracking,
    clearDirtyTracking,
  ]);

  const hasUnsavedChanges =
    isDirty !== undefined ? isDirty : (lastSavedRef.current !== '' && JSON.stringify(customization) !== lastSavedRef.current);

  return { handleSave, saving, saved, lastSavedRef, hasUnsavedChanges };
}
