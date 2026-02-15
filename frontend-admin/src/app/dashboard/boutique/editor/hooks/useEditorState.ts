'use client';

import { useState, useCallback, useRef } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import type { BlockId } from '../editor-types';
import { DEFAULT_SECTION_ORDER, HOME_BLOCKS } from '../editor-constants';

export function useEditorState() {
  const [selectedBlock, setSelectedBlock] = useState<BlockId | null>(null);
  const [customization, setCustomization] = useState<ThemeCustomization>({});
  const [history, setHistory] = useState<ThemeCustomization[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);

  const sectionOrder = customization.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const orderedHomeBlocks = sectionOrder.filter((id) =>
    HOME_BLOCKS.some((b) => b.id === id && (b.template === 'all' || b.template === 'home'))
  );

  const pushHistory = useCallback((cust: ThemeCustomization) => {
    if (isUndoRedoRef.current) return;
    setHistory((h) => {
      const next = [...h.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(cust))].slice(-50);
      queueMicrotask(() => setHistoryIndex(next.length - 1));
      return next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    isUndoRedoRef.current = true;
    setHistoryIndex(historyIndex - 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    isUndoRedoRef.current = true;
    setHistoryIndex(historyIndex + 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const update = useCallback(
    <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => {
      const next = { ...customization, [key]: value };
      setCustomization(next);
      pushHistory(next);
    },
    [customization, pushHistory]
  );

  const updateNested = useCallback(
    <K extends keyof ThemeCustomization>(key: K, subKey: string, value: string | number) => {
      setCustomization((prev) => {
        const obj = prev[key];
        const n = {
          ...prev,
          [key]: typeof obj === 'object' && obj !== null ? { ...obj, [subKey]: value } : { [subKey]: value },
        };
        pushHistory(n);
        return n;
      });
    },
    [pushHistory]
  );

  return {
    selectedBlock,
    setSelectedBlock,
    customization,
    setCustomization,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    orderedHomeBlocks,
    update,
    updateNested,
    undo,
    redo,
    pushHistory,
  };
}
