'use client';

import { Box } from '@mantine/core';
import { LoadingScreen } from '@/components/LoadingScreen';

interface EditorCanvasProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeSrc: string;
  currentTemplatePath: string;
  viewport: 'desktop' | 'tablet' | 'mobile';
  showCanvasLoader: boolean;
  canvasReady: boolean;
  onIframeLoad: () => void;
  draggedId: string | null;
  dropOverIndex: number | null;
  orderedHomeBlocks: string[];
  setDropOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onCanvasDrop: (e: React.DragEvent, insertIndex: number) => void;
  className?: string;
}

export function EditorCanvas(props: EditorCanvasProps) {
  const {
    iframeRef,
    iframeSrc,
    currentTemplatePath,
    viewport,
    showCanvasLoader,
    canvasReady,
    onIframeLoad,
    draggedId,
    dropOverIndex,
    orderedHomeBlocks,
    setDropOverIndex,
    onCanvasDrop,
    className,
  } = props;

  const width = viewport === 'mobile' ? 375 : viewport === 'tablet' ? 768 : '100%';

  return (
    <Box className={className}>
      <Box
        style={{
          width,
          maxWidth: '100%',
          boxShadow: viewport !== 'desktop' ? '0 0 20px rgba(0,0,0,0.15)' : 'none',
          position: 'relative',
          height: '100%',
          minHeight: 200,
          transition: 'width 0.3s',
        }}
      >
        {iframeSrc && showCanvasLoader && !canvasReady && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <LoadingScreen />
          </Box>
        )}
        <iframe
          ref={iframeRef as React.RefObject<HTMLIFrameElement>}
          id="store-iframe"
          key={currentTemplatePath}
          src={iframeSrc}
          title="Ma boutique"
          style={{ width: '100%', height: '100%', border: 'none' }}
          onLoad={onIframeLoad}
        />
        {draggedId && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: 'auto',
              zIndex: 50,
              minHeight: 200,
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDragLeave={() => setDropOverIndex(null)}
          >
            <Box
              component="span"
              style={{
                flexShrink: 0,
                padding: '4px 0',
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--mantine-color-dimmed)',
                background: 'rgba(255,255,255,0.9)',
              }}
            >
              Glissez ici pour ajouter ou repositionner un bloc
            </Box>
            {orderedHomeBlocks.map((_, i) => (
              <Box
                key={`drop-${i}`}
                style={{
                  flex: 1,
                  minHeight: 24,
                  border: dropOverIndex === i ? '2px dashed var(--mantine-color-green-6)' : 'none',
                  backgroundColor: dropOverIndex === i ? 'rgba(64, 192, 87, 0.08)' : 'transparent',
                  transition: 'border 0.1s, background 0.1s',
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = 'copy';
                  setDropOverIndex(i);
                }}
                onDragLeave={() => setDropOverIndex((prev) => (prev === i ? null : prev))}
                onDrop={(e) => onCanvasDrop(e, i)}
              >
                {dropOverIndex === i && (
                  <Box component="span" style={{ fontSize: 12, color: 'var(--mantine-color-green-6)', textAlign: 'center', display: 'block', marginTop: 2 }}>
                    Déposer ici
                  </Box>
                )}
              </Box>
            ))}
            <Box
              style={{
                flex: 1,
                minHeight: 24,
                border: dropOverIndex === orderedHomeBlocks.length ? '2px dashed var(--mantine-color-green-6)' : 'none',
                backgroundColor: dropOverIndex === orderedHomeBlocks.length ? 'rgba(64, 192, 87, 0.08)' : 'transparent',
                transition: 'border 0.1s, background 0.1s',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                setDropOverIndex(orderedHomeBlocks.length);
              }}
              onDragLeave={() => setDropOverIndex((prev) => (prev === orderedHomeBlocks.length ? null : prev))}
              onDrop={(e) => onCanvasDrop(e, orderedHomeBlocks.length)}
            >
              {dropOverIndex === orderedHomeBlocks.length && (
                <Box component="span" style={{ fontSize: 12, color: 'var(--mantine-color-green-6)', textAlign: 'center', display: 'block', marginTop: 4 }}>
                  Déposer ici
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
