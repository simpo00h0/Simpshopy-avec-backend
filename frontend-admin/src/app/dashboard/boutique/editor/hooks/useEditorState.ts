'use client';

import { useState, useCallback, useRef } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import type { BlockId } from '../editor-types';
import { DEFAULT_SECTION_ORDER, HOME_BLOCKS } from '../editor-constants';
import { migrateToBlockInstances } from '../editor-migration';

function genBlockId(): string {
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useEditorState() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [customization, setCustomization] = useState<ThemeCustomization>(() =>
    migrateToBlockInstances({})
  );
  const [history, setHistory] = useState<ThemeCustomization[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);

  const migrated = customization.blocks ? customization : migrateToBlockInstances(customization);
  const blocks = migrated.blocks ?? {};
  const sectionOrder = migrated.sectionOrder ?? [];
  const orderedHomeBlocks = sectionOrder.filter((id) => blocks[id] && blocks[id].type !== 'logo');
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const pushHistory = useCallback((cust: ThemeCustomization) => {
    if (isUndoRedoRef.current) return;
    setHistory((h) => {
      const next = [...h.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(cust))].slice(-50);
      setHistoryIndex(next.length - 1);
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

  const updateBlockData = useCallback(
    (instanceId: string, data: Record<string, unknown>) => {
      setCustomization((prev) => {
        const block = prev.blocks?.[instanceId];
        if (!block) return prev;
        const next = {
          ...prev,
          blocks: {
            ...prev.blocks,
            [instanceId]: { ...block, data: { ...block.data, ...data } },
          },
        };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const updateBlockNested = useCallback(
    (instanceId: string, subKey: string, value: string | number) => {
      setCustomization((prev) => {
        const block = prev.blocks?.[instanceId];
        if (!block) return prev;
        const obj = block.data as Record<string, unknown>;
        const next = {
          ...prev,
          blocks: {
            ...prev.blocks,
            [instanceId]: {
              ...block,
              data: { ...obj, [subKey]: value },
            },
          },
        };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const ensureLogoBlock = useCallback(() => {
    const blks = blocksRef.current;
    const existing = Object.entries(blks).find(([, b]) => b.type === 'logo');
    if (existing) return existing[0];
    const instanceId = genBlockId();
    setCustomization((prev) => {
      const prevBlocks = prev.blocks ?? {};
      const next = {
        ...prev,
        blocks: { ...prevBlocks, [instanceId]: { type: 'logo' as const, data: {} } },
      };
      pushHistory(next);
      return next;
    });
    return instanceId;
  }, [pushHistory]);

  const addBlockAt = useCallback(
    (typeId: BlockId, insertIndex: number) => {
      const instanceId = genBlockId();
      setCustomization((prev) => {
        const blocks = prev.blocks ?? {};
        const order = [...(prev.sectionOrder ?? [])];
        order.splice(Math.min(insertIndex, order.length), 0, instanceId);
        const next = {
          ...prev,
          blocks: { ...blocks, [instanceId]: { type: typeId, data: {} } },
          sectionOrder: order,
        };
        pushHistory(next);
        return next;
      });
      return instanceId;
    },
    [pushHistory]
  );

  const addBlock = useCallback(
    (typeId: BlockId) => addBlockAt(typeId, orderedHomeBlocks.length),
    [addBlockAt, orderedHomeBlocks.length]
  );

  const removeBlock = useCallback(
    (instanceId: string) => {
      setCustomization((prev) => {
        const blocks = { ...prev.blocks };
        delete blocks[instanceId];
        const order = (prev.sectionOrder ?? []).filter((id) => id !== instanceId);
        const next = { ...prev, blocks, sectionOrder: order };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const reorderBlocks = useCallback(
    (newOrder: string[]) => {
      setCustomization((prev) => {
        const next = { ...prev, sectionOrder: newOrder };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const resetToDefaults = useCallback(() => {
    const next = migrateToBlockInstances({});
    setCustomization(next);
    pushHistory(next);
    setSelectedBlock(null);
  }, [pushHistory]);

  return {
    selectedBlock,
    setSelectedBlock,
    customization,
    ensureLogoBlock,
    setCustomization,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    orderedHomeBlocks,
    blocks,
    update,
    updateNested,
    updateBlockData,
    updateBlockNested,
    addBlock,
    addBlockAt,
    removeBlock,
    reorderBlocks,
    resetToDefaults,
    undo,
    redo,
    pushHistory,
  };
}
