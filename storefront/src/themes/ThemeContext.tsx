'use client';

import { createContext, useContext } from 'react';
import type { ThemeConfig } from './theme-types';

interface ThemeContextValue {
  theme: ThemeConfig;
  basePath: string;
  isPreview: boolean;
  isEditor: boolean;
  /** En mode éditeur : true = masquer bordures/labels pour voir l’aperçu propre */
  isPreviewMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  theme,
  basePath,
  isPreview,
  isEditor,
  isPreviewMode,
  children,
}: {
  theme: ThemeConfig;
  basePath: string;
  isPreview?: boolean;
  isEditor?: boolean;
  isPreviewMode?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider
      value={{
        theme,
        basePath,
        isPreview: isPreview ?? false,
        isEditor: isEditor ?? false,
        isPreviewMode: isPreviewMode ?? false,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
