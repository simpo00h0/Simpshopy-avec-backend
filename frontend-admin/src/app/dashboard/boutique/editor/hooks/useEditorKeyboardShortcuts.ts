'use client';

import { useEffect } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';

interface UseEditorKeyboardShortcutsParams {
  handleSave: () => void | Promise<boolean>;
  undo: () => void;
  redo: () => void;
  toggleShortcuts: () => void;
  setAddBlockOpen: (v: boolean) => void;
  customization: ThemeCustomization;
  lastSavedRef: React.MutableRefObject<string>;
  allowLeaveRef: React.MutableRefObject<boolean>;
}

export function useEditorKeyboardShortcuts(params: UseEditorKeyboardShortcutsParams): void {
  const {
    handleSave,
    undo,
    redo,
    toggleShortcuts,
    setAddBlockOpen,
    customization,
    lastSavedRef,
    allowLeaveRef,
  } = params;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleShortcuts();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAddBlockOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, undo, redo, toggleShortcuts, setAddBlockOpen]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      if (JSON.stringify(customization) !== lastSavedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [customization, lastSavedRef, allowLeaveRef]);
}
