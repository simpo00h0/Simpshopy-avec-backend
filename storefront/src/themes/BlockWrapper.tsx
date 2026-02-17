'use client';

import { useEffect, useRef, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { useTheme } from './ThemeContext';

const SIMPSHOPY_EDITOR_EVENT = 'simpshopy-block-select';
const SIMPSHOPY_SCROLL_TO_BLOCK = 'simpshopy-scroll-to-block';
const SIMPSHOPY_SELECTED_BLOCK = 'simpshopy-selected-block';
export const SIMPSHOPY_BLOCK_DELETE = 'simpshopy-block-delete';

export function BlockWrapper({
  blockId,
  label,
  children,
}: {
  blockId: string;
  label: string;
  children: React.ReactNode;
}) {
  const { isEditor, isPreviewMode } = useTheme();
  const elRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isEditor || isPreviewMode) return;
    const handler = (e: MessageEvent) => {
      const d = e.data;
      if (!d?.type) return;
      if (d.type === SIMPSHOPY_SCROLL_TO_BLOCK && d.blockId === blockId && elRef.current) {
        elRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (d.type === SIMPSHOPY_SELECTED_BLOCK) {
        setIsSelected(d.blockId === blockId);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isEditor, isPreviewMode, blockId]);

  if (!isEditor || isPreviewMode) {
    return <>{children}</>;
  }

  const handleSelect = (e: React.SyntheticEvent) => {
    if (touchedRef.current) {
      touchedRef.current = false;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    window.parent?.postMessage({ type: SIMPSHOPY_EDITOR_EVENT, blockId, label }, '*');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(e);
    }
  };

  return (
    <div
      ref={elRef}
      id={`block-${blockId}`}
      data-block-id={blockId}
      role="button"
      tabIndex={0}
      aria-label={`Bloc : ${label}. Cliquez pour modifier.`}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      onTouchEnd={(e) => {
        touchedRef.current = true;
        e.preventDefault();
        e.stopPropagation();
        window.parent?.postMessage({ type: SIMPSHOPY_EDITOR_EVENT, blockId, label }, '*');
      }}
      style={{
        position: 'relative',
        outline: isSelected ? '3px solid #40c057' : '2px dashed rgba(34, 139, 34, 0.5)',
        outlineOffset: -2,
        cursor: 'pointer',
        touchAction: 'manipulation',
        minHeight: 44,
        boxShadow: isSelected ? '0 0 0 2px rgba(64, 192, 87, 0.3)' : undefined,
        transition: 'outline-color 0.2s, background 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.outlineColor = 'rgba(34, 139, 34, 0.9)';
        e.currentTarget.style.backgroundColor = 'rgba(34, 139, 34, 0.05)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.outlineColor = isSelected ? 'rgba(64, 192, 87, 1)' : 'rgba(34, 139, 34, 0.5)';
        e.currentTarget.style.backgroundColor = 'transparent';
        if (!isSelected) e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 8,
          zIndex: 10,
          background: '#40c057',
          color: 'white',
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          pointerEvents: 'none',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      {isHovered && (
        <button
          type="button"
          aria-label="Supprimer le bloc"
          title="Supprimer le bloc"
          style={{
            position: 'absolute',
            top: 4,
            right: 8,
            zIndex: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: 'none',
            borderRadius: 4,
            background: 'rgba(232, 53, 53, 0.95)',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.parent?.postMessage({ type: SIMPSHOPY_BLOCK_DELETE, blockId }, '*');
          }}
        >
          <IconTrash size={14} />
        </button>
      )}
      {children}
    </div>
  );
}
