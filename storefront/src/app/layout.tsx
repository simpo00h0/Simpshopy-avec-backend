import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

export const metadata = {
  title: {
    default: 'Simpshopy - Créez votre boutique en ligne',
    template: '%s | Simpshopy',
  },
  description:
    'Plateforme e-commerce pour créer et gérer votre boutique en ligne. Référencement SEO optimisé, paiement Mobile Money, livraison.',
  keywords: ['boutique en ligne', 'e-commerce', 'créer boutique', 'vente en ligne', 'Mobile Money'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
  },
  robots: { index: true, follow: true },
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
            {children}
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
