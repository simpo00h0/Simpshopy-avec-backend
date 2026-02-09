import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

export const metadata = {
  title: 'Simpshopy - Boutique en ligne',
  description: 'Découvrez nos produits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider>
            {children}
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
