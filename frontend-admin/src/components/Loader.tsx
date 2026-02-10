'use client';

import { Box } from '@mantine/core';
import styles from '@/styles/loader.module.css';

interface LoaderProps {
  /** Taille en px (hauteur des cercles) */
  size?: number;
  /** Pour centrer dans un conteneur */
  centered?: boolean;
  /** Class name additionnel */
  className?: string;
}

export function Loader({ size = 20, centered, className }: LoaderProps) {
  const loaderEl = (
    <Box
      component="div"
      className={[styles.loader, className].filter(Boolean).join(' ')}
      style={{ ['--loader-size' as string]: `${size}px` }}
      role="status"
      aria-label="Chargement"
    />
  );
  if (centered) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: 60 }}>
        {loaderEl}
      </Box>
    );
  }
  return loaderEl;
}
