'use client';

import { useParams } from 'next/navigation';
import { ThemeProvider } from '@/themes/ThemeContext';
import { ThemeLayout } from '@/themes/ThemeLayout';
import { themesData } from '@/themes/data';

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const themeId = params.themeId as string;
  const theme = themesData[themeId];

  if (!theme) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Thème introuvable</h1>
        <p>Le thème &quot;{themeId}&quot; n&apos;existe pas.</p>
        <p>Thèmes disponibles : {Object.keys(themesData).join(', ')}</p>
      </div>
    );
  }

  const basePath = `/preview/${themeId}`;

  return (
    <ThemeProvider theme={theme} basePath={basePath} storeSubdomain="preview" isPreview isEditor={false}>
      <ThemeLayout>{children}</ThemeLayout>
    </ThemeProvider>
  );
}
