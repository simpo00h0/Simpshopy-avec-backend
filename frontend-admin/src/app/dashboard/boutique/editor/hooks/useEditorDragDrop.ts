'use client';

import { useState, useCallback } from 'react';
import type { BlockId } from '../editor-types';
import {
  CANVAS_SOURCE_INDEX_KEY,
  DRAG_SOURCE_LIBRARY,
  DRAG_SOURCE_CANVAS,
} from '../editor-constants';
import type { UpdateFn } from '../editor-types';

const DRAG_BLOCK_ID_KEY = 'application/x-simpshopy-block-id';
const DRAG_SOURCE_KEY = 'application/x-simpshopy-drag-source';

interface UseEditorDragDropParams {
  orderedHomeBlocks: string[];
  selectedBlock: BlockId | null;
  update: UpdateFn;
  setSelectedBlock: React.Dispatch<React.SetStateAction<BlockId | null>>;
}

export function useEditorDragDrop(params: UseEditorDragDropParams) {
  const { orderedHomeBlocks, selectedBlock, update, setSelectedBlock } = params;
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropOverIndex, setDropOverIndex] = useState<number | null>(null);

  const removeBlockAtIndex = useCallback(
    (index: number) => {
      const order = [...orderedHomeBlocks];
      if (index < 0 || index >= order.length) return;
      const [removed] = order.splice(index, 1);
      update('sectionOrder', order);
      if (removed === selectedBlock) setSelectedBlock(null);
    },
    [orderedHomeBlocks, update, selectedBlock, setSelectedBlock]
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
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent, insertIndex: number) => {
      e.preventDefault();
      setDraggedId(null);
      setDropOverIndex(null);

      const blockId = e.dataTransfer.getData(DRAG_BLOCK_ID_KEY) as BlockId | '';
      const source = e.dataTransfer.getData(DRAG_SOURCE_KEY);
      const sourceIndexRaw = e.dataTransfer.getData(CANVAS_SOURCE_INDEX_KEY);

      if (source === DRAG_SOURCE_CANVAS && sourceIndexRaw !== '') {
        const sourceIndex = parseInt(sourceIndexRaw, 10);
        if (!Number.isNaN(sourceIndex) && sourceIndex >= 0 && sourceIndex < orderedHomeBlocks.length) {
          const order = [...orderedHomeBlocks];
          const [removed] = order.splice(sourceIndex, 1);
          if (removed) {
            const adjIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;
            order.splice(Math.min(adjIndex, order.length), 0, removed);
            update('sectionOrder', order);
          }
          return;
        }
      }

      if (blockId && source === DRAG_SOURCE_LIBRARY) {
        const order = [...orderedHomeBlocks];
        order.splice(Math.min(insertIndex, order.length), 0, blockId);
        update('sectionOrder', order);
      }
    },
    [orderedHomeBlocks, update]
  );

  return {
    draggedId,
    dropOverIndex,
    setDropOverIndex,
    removeBlockAtIndex,
    handleLibraryDragStart,
    handleDragEnd,
    handleCanvasDrop,
  };
}
