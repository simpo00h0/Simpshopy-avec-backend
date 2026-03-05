'use client';

import { useState, useCallback, useEffect } from 'react';
import { DRAG_SOURCE_LIBRARY, LOGO_BLOCK_ID } from '../editor-constants';
import type { BlockId } from '../editor-types';

const DRAG_BLOCK_ID_KEY = 'application/x-simpshopy-block-id';
const DRAG_SOURCE_KEY = 'application/x-simpshopy-drag-source';

interface UseEditorDragDropParams {
  orderedHomeBlocks: string[];
  selectedBlock: string | null;
  addBlockAt: (typeId: BlockId, insertIndex: number) => string;
  removeBlock: (instanceId: string) => void;
  reorderBlocks: (newOrder: string[]) => void;
  setSelectedBlock: React.Dispatch<React.SetStateAction<string | null>>;
  onLogoBlockSelect?: () => void;
}

export function useEditorDragDrop(params: UseEditorDragDropParams) {
  const { orderedHomeBlocks, selectedBlock, addBlockAt, removeBlock, reorderBlocks, setSelectedBlock, onLogoBlockSelect } = params;
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropOverIndex, setDropOverIndex] = useState<number | null>(null);
  const [canvasDragState, setCanvasDragState] = useState<{ blockId: string; index: number } | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'simpshopy-canvas-drag-start' && e.data.blockId != null && typeof e.data.index === 'number') {
        setCanvasDragState({ blockId: e.data.blockId, index: e.data.index });
        setDraggedId(e.data.blockId);
      }
      if (e.data?.type === 'simpshopy-canvas-drag-end') {
        setCanvasDragState(null);
        setDraggedId(null);
      }
      if (e.data?.type === 'simpshopy-canvas-drop' && typeof e.data.insertIndex === 'number' && typeof e.data.sourceIndex === 'number') {
        const { insertIndex, blockId, sourceIndex } = e.data;
        if (sourceIndex >= 0 && sourceIndex < orderedHomeBlocks.length) {
          const order = [...orderedHomeBlocks];
          const [removed] = order.splice(sourceIndex, 1);
          if (removed) {
            const adjIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;
            order.splice(Math.min(adjIndex, order.length), 0, removed);
            reorderBlocks(order);
          }
        }
        setCanvasDragState(null);
        setDraggedId(null);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [orderedHomeBlocks, reorderBlocks]);

  useEffect(() => {
    if (!draggedId && canvasDragState) setCanvasDragState(null);
  }, [draggedId, canvasDragState]);

  const removeBlockAtIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= orderedHomeBlocks.length) return;
      const instanceId = orderedHomeBlocks[index];
      removeBlock(instanceId);
      if (instanceId === selectedBlock) setSelectedBlock(null);
    },
    [orderedHomeBlocks, removeBlock, selectedBlock, setSelectedBlock]
  );

  const handleLibraryDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData(DRAG_BLOCK_ID_KEY, blockId);
    e.dataTransfer.setData(DRAG_SOURCE_KEY, DRAG_SOURCE_LIBRARY);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedId(blockId);
  }, []);

  const handleDragEnd = useCallback((_e: React.DragEvent) => {
    setDraggedId(null);
    setDropOverIndex(null);
    setCanvasDragState(null);
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent, insertIndex: number) => {
      e.preventDefault();
      setDropOverIndex(null);

      const blockId = e.dataTransfer.getData(DRAG_BLOCK_ID_KEY) as string;
      const source = e.dataTransfer.getData(DRAG_SOURCE_KEY);

      if (blockId && source === DRAG_SOURCE_LIBRARY) {
        if (blockId === LOGO_BLOCK_ID && onLogoBlockSelect) {
          onLogoBlockSelect();
          setDraggedId(null);
          return;
        }
        addBlockAt(blockId as BlockId, insertIndex);
      }
      setDraggedId(null);
    },
    [addBlockAt, onLogoBlockSelect]
  );

  return {
    draggedId,
    dropOverIndex,
    canvasDragState,
    setDropOverIndex,
    removeBlockAtIndex,
    handleLibraryDragStart,
    handleDragEnd,
    handleCanvasDrop,
  };
}
