'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

/** Applique la protection du contenu (clic droit, sélection, copie, glisser images) quand activée. */
export function ContentProtection() {
  const { theme, isEditor } = useTheme();
  const enabled = theme.contentProtection === true && !isEditor;

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const preventContextMenu = (e: Event) => e.preventDefault();
    const preventSelectStart = (e: Event) => e.preventDefault();
    const preventCopy = (e: Event) => e.preventDefault();
    const preventDragStart = (e: Event) => e.preventDefault();

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelectStart);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('dragstart', preventDragStart);

    const style = document.createElement('style');
    style.textContent = 'body, body * { user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; }';
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelectStart);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('dragstart', preventDragStart);
      style.remove();
    };
  }, [enabled]);

  return null;
}
