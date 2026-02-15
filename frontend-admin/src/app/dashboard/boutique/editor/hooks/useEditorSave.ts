'use client';

import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { useStoreStore, type ThemeCustomization, type Store } from '@/stores/storeStore';

export function useEditorSave(
  customization: ThemeCustomization,
  currentStore: Store | null
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
      const res = await api.patch(`/stores/${currentStore.id}/settings`, { themeCustomization: customization });
      const updated = res.data as Store | undefined;
      if (updated) setCurrentStore(updated);
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
  }, [currentStore, customization, setCurrentStore]);

  const hasUnsavedChanges =
    lastSavedRef.current !== '' && JSON.stringify(customization) !== lastSavedRef.current;

  return { handleSave, saving, saved, lastSavedRef, hasUnsavedChanges };
}
