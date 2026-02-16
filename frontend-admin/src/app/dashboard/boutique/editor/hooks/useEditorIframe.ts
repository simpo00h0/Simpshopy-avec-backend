'use client';

import { useEffect, useRef, useState } from 'react';
import type { ThemeCustomization } from '@simpshopy/shared';
import type { BlockId } from '../editor-types';
import {
  EDITOR_CACHED_KEY,
  SIMPSHOPY_EDITOR_EVENT,
  SIMPSHOPY_BLOCK_DELETE,
  SIMPSHOPY_THEME_UPDATE,
  SIMPSHOPY_SELECTED_BLOCK,
  SIMPSHOPY_SCROLL_TO_BLOCK,
} from '../editor-constants';
import { getStorefrontOrigin } from '../editor-utils';

const EDITOR_READY_TIMEOUT_MS = 15000;

export function useEditorIframe(
  iframeSrc: string,
  customization: ThemeCustomization,
  previewMode: boolean,
  selectedBlock: BlockId | null,
  selectBlock: (id: BlockId) => void,
  removeBlockAtIndex: (index: number) => void
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showCanvasLoader, setShowCanvasLoader] = useState(false);

  useEffect(() => {
    if (!iframeSrc) return;
    setCanvasReady(false);
    setShowCanvasLoader(false);
    const t = setTimeout(() => {
      if (typeof window !== 'undefined' && window.sessionStorage?.getItem(EDITOR_CACHED_KEY) !== '1') {
        setShowCanvasLoader(true);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [iframeSrc]);

  useEffect(() => {
    if (!iframeSrc) return;
    const allowedOrigin = getStorefrontOrigin(iframeSrc);
    const handler = (e: MessageEvent) => {
      if (allowedOrigin && e.origin !== allowedOrigin) return;
      if (e.data?.type === 'simpshopy-editor-ready') {
        setCanvasReady(true);
        try {
          window.sessionStorage?.setItem(EDITOR_CACHED_KEY, '1');
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('message', handler);
    const timeout = setTimeout(() => setCanvasReady(true), EDITOR_READY_TIMEOUT_MS);
    return () => {
      window.removeEventListener('message', handler);
      clearTimeout(timeout);
    };
  }, [iframeSrc]);

  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.postMessage({ type: SIMPSHOPY_THEME_UPDATE, customization }, '*');
      win.postMessage({ type: 'simpshopy-preview-mode', preview: previewMode }, '*');
    }
  }, [customization, previewMode]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: SIMPSHOPY_SELECTED_BLOCK, blockId: selectedBlock }, '*');
  }, [selectedBlock]);

  useEffect(() => {
    const allowedOrigin = getStorefrontOrigin(iframeSrc);
    const handler = (e: MessageEvent) => {
      if (allowedOrigin && e.origin !== allowedOrigin) return;
      if (e.data?.type === SIMPSHOPY_EDITOR_EVENT && e.data.blockId) selectBlock(e.data.blockId as BlockId);
      if (e.data?.type === SIMPSHOPY_BLOCK_DELETE && typeof e.data.indexInOrder === 'number') removeBlockAtIndex(e.data.indexInOrder);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [selectBlock, removeBlockAtIndex]);

  const scrollToBlock = (blockId: BlockId) => {
    iframeRef.current?.contentWindow?.postMessage({ type: SIMPSHOPY_SCROLL_TO_BLOCK, blockId }, '*');
  };

  const onIframeLoad = () => setCanvasReady(true);

  return { iframeRef, canvasReady, showCanvasLoader, scrollToBlock, onIframeLoad };
}
