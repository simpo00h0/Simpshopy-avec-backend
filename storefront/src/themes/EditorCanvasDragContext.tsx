'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface CanvasDragState {
  blockId: string;
  index: number;
}

interface EditorCanvasDragContextValue {
  canvasDrag: CanvasDragState | null;
  setCanvasDrag: (state: CanvasDragState | null) => void;
}

const EditorCanvasDragContext = createContext<EditorCanvasDragContextValue | null>(null);

export function EditorCanvasDragProvider({ children }: { children: React.ReactNode }) {
  const [canvasDrag, setCanvasDrag] = useState<CanvasDragState | null>(null);
  return (
    <EditorCanvasDragContext.Provider value={{ canvasDrag, setCanvasDrag }}>
      {children}
    </EditorCanvasDragContext.Provider>
  );
}

export function useEditorCanvasDrag() {
  const ctx = useContext(EditorCanvasDragContext);
  if (!ctx) return null;
  return ctx;
}
