'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

export function FaviconUpdater() {
  const { theme } = useTheme();
  const favicon = theme.favicon;

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[data-simpshopy-favicon]');
    if (favicon) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.setAttribute('data-simpshopy-favicon', 'true');
        document.head.appendChild(link);
      }
      link.href = favicon;
    } else if (link?.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, [favicon]);

  return null;
}
