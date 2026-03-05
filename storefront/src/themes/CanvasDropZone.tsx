'use client';

import { useState } from 'react';
import { useTheme } from './ThemeContext';

const DRAG_BLOCK_ID_KEY = 'application/x-simpshopy-block-id';
const DRAG_SOURCE_KEY = 'application/x-simpshopy-drag-source';
const CANVAS_SOURCE_INDEX_KEY = 'application/x-simpshopy-source-index';

interface CanvasDropZoneProps {
  insertIndex: number;
  active: boolean;
  onDrop: (insertIndex: number, blockId: string, sourceIndex: number) => void;
}

export function CanvasDropZone({ insertIndex, active, onDrop }: CanvasDropZoneProps) {
  const { isEditor, isPreviewMode } = useTheme();
  const [isOver, setIsOver] = useState(false);

  if (!isEditor || isPreviewMode) return null;

  const handleDragOver = (e: React.DragEvent) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e: React.DragEvent) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    const blockId = e.dataTransfer.getData(DRAG_BLOCK_ID_KEY);
    const source = e.dataTransfer.getData(DRAG_SOURCE_KEY);
    const sourceIndexRaw = e.dataTransfer.getData(CANVAS_SOURCE_INDEX_KEY);

    if (source === 'canvas' && blockId && sourceIndexRaw !== '') {
      const sourceIndex = parseInt(sourceIndexRaw, 10);
      if (!Number.isNaN(sourceIndex)) {
        onDrop(insertIndex, blockId, sourceIndex);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: active ? 32 : 6,
        minWidth: '100%',
        pointerEvents: active ? 'auto' : 'none',
        border: isOver ? '2px dashed #40c057' : '2px dashed transparent',
        backgroundColor: isOver ? 'rgba(64, 192, 87, 0.08)' : 'transparent',
        transition: 'border 0.1s, background 0.1s, min-height 0.15s',
        flexShrink: 0,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isOver && (
        <span style={{ fontSize: 12, color: '#40c057', display: 'block', textAlign: 'center', padding: 2 }}>
          Déposer ici
        </span>
      )}
    </div>
  );
}
