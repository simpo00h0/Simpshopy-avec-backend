import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  title: 'Simpshopy - Créez votre boutique en ligne | Zone CFA Afrique de l\'Ouest',
  description: 'La plateforme e-commerce pour vendre en ligne en Afrique de l\'Ouest. Paiement Mobile Money, commission réduite, simple à utiliser.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider>
            <Notifications position="top-right" />
            {children}
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
