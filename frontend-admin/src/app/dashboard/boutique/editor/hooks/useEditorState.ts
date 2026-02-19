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
  const [isDirty, setIsDirty] = useState(false);
  const isUndoRedoRef = useRef(false);
  const dirtyBlocksFullRef = useRef(false);
  const dirtyBlockIdsRef = useRef<Set<string>>(new Set());
  const dirtySectionsRef = useRef<Set<string>>(new Set());

  const migrated = customization.blocks ? customization : migrateToBlockInstances(customization);
  const blocks = migrated.blocks ?? {};
  const sectionOrder = migrated.sectionOrder ?? [];
  const orderedHomeBlocks = sectionOrder.filter((id) => blocks[id] && blocks[id].type !== 'logo');
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const markDirtyBlockId = useCallback((instanceId: string) => {
    dirtyBlockIdsRef.current.add(instanceId);
  }, []);
  const markDirtyBlocksFull = useCallback(() => {
    dirtyBlocksFullRef.current = true;
    dirtyBlockIdsRef.current.clear();
  }, []);
  const markDirtySection = useCallback((key: string) => {
    dirtySectionsRef.current.add(key);
  }, []);

  const pushHistory = useCallback((cust: ThemeCustomization) => {
    if (isUndoRedoRef.current) return;
    setIsDirty(true);
    setHistory((h) => {
      const next = [...h.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(cust))].slice(-50);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    isUndoRedoRef.current = true;
    setIsDirty(true);
    setHistoryIndex(historyIndex - 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    isUndoRedoRef.current = true;
    setIsDirty(true);
    setHistoryIndex(historyIndex + 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const update = useCallback(
    <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => {
      markDirtySection(key as string);
      const next = { ...customization, [key]: value };
      setCustomization(next);
      pushHistory(next);
    },
    [customization, pushHistory, markDirtySection]
  );

  const updateNested = useCallback(
    <K extends keyof ThemeCustomization>(key: K, subKey: string, value: string | number) => {
      markDirtySection(key as string);
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
    [pushHistory, markDirtySection]
  );

  const updateBlockData = useCallback(
    (instanceId: string, data: Record<string, unknown>) => {
      markDirtyBlockId(instanceId);
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
    [pushHistory, markDirtyBlockId]
  );

  const updateBlockNested = useCallback(
    (instanceId: string, subKey: string, value: string | number) => {
      markDirtyBlockId(instanceId);
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
    [pushHistory, markDirtyBlockId]
  );

  const ensureLogoBlock = useCallback(() => {
    markDirtyBlocksFull();
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
  }, [pushHistory, markDirtyBlocksFull]);

  const addBlockAt = useCallback(
    (typeId: BlockId, insertIndex: number) => {
      markDirtyBlocksFull();
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
    [pushHistory, markDirtyBlocksFull]
  );

  const addBlock = useCallback(
    (typeId: BlockId) => addBlockAt(typeId, orderedHomeBlocks.length),
    [addBlockAt, orderedHomeBlocks.length]
  );

  const removeBlock = useCallback(
    (instanceId: string) => {
      markDirtyBlocksFull();
      setCustomization((prev) => {
        const blocks = { ...prev.blocks };
        delete blocks[instanceId];
        const order = (prev.sectionOrder ?? []).filter((id) => id !== instanceId);
        const next = { ...prev, blocks, sectionOrder: order };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory, markDirtyBlocksFull]
  );

  const reorderBlocks = useCallback(
    (newOrder: string[]) => {
      markDirtyBlocksFull();
      setCustomization((prev) => {
        const next = { ...prev, sectionOrder: newOrder };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory, markDirtyBlocksFull]
  );

  const resetToDefaults = useCallback(() => {
    dirtyBlocksFullRef.current = true;
    dirtySectionsRef.current.clear();
    const next = migrateToBlockInstances({});
    setCustomization(next);
    pushHistory(next);
    setSelectedBlock(null);
  }, [pushHistory]);

  const getPartialPayload = useCallback(
    (cust: ThemeCustomization): Partial<ThemeCustomization> => {
      const partial: Partial<ThemeCustomization> = {};
      if (dirtyBlocksFullRef.current) {
        partial.blocks = cust.blocks;
        partial.sectionOrder = cust.sectionOrder;
      } else if (dirtyBlockIdsRef.current.size > 0 && cust.blocks) {
        const blocks: Record<string, { type: string; data: Record<string, unknown> }> = {};
        for (const id of dirtyBlockIdsRef.current) {
          const block = cust.blocks[id];
          if (block) blocks[id] = block;
        }
        if (Object.keys(blocks).length > 0) partial.blocks = blocks;
      }
      for (const key of dirtySectionsRef.current) {
        const val = cust[key as keyof ThemeCustomization];
        if (val !== undefined) {
          (partial as Record<string, unknown>)[key] = val;
        }
      }
      return partial;
    },
    []
  );

  const clearDirtyTracking = useCallback(() => {
    dirtyBlocksFullRef.current = false;
    dirtyBlockIdsRef.current.clear();
    dirtySectionsRef.current.clear();
  }, []);

  const hasDirtyTracking = useCallback(() => {
    return (
      dirtyBlocksFullRef.current ||
      dirtyBlockIdsRef.current.size > 0 ||
      dirtySectionsRef.current.size > 0
    );
  }, []);

  return {
    selectedBlock,
    setSelectedBlock,
    customization,
    ensureLogoBlock,
    setCustomization,
    setDirty: setIsDirty,
    isDirty,
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
    getPartialPayload,
    clearDirtyTracking,
    hasDirtyTracking,
  };
}
