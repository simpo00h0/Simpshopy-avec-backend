'use client';

import { createContext, useContext } from 'react';
import type { ThemeConfig } from './theme-types';

interface ThemeContextValue {
  theme: ThemeConfig;
  basePath: string;
  storeSubdomain: string;
  isPreview: boolean;
  isEditor: boolean;
  /** En mode éditeur : true = masquer bordures/labels pour voir l’aperçu propre */
  isPreviewMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  theme,
  basePath,
  storeSubdomain = 'preview',
  isPreview,
  isEditor,
  isPreviewMode,
  children,
}: {
  theme: ThemeConfig;
  basePath: string;
  storeSubdomain?: string;
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
        storeSubdomain,
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

/** Fournit un thème fusionné avec des surcharges (pour un bloc du canvas) */
export function BlockThemeProvider({
  overrides,
  children,
}: {
  overrides: Partial<ThemeConfig>;
  children: React.ReactNode;
}) {
  const parent = useTheme();
  const mergedTheme = { ...parent.theme, ...overrides } as ThemeConfig;
  return (
    <ThemeContext.Provider value={{ ...parent, theme: mergedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
