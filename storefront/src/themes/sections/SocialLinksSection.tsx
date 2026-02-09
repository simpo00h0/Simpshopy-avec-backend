'use client';

import { Group, Anchor } from '@mantine/core';
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandWhatsapp } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';

const ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  twitter: IconBrandX,
  whatsapp: IconBrandWhatsapp,
};

export function SocialLinksSection() {
  const { theme } = useTheme();
  const links = theme.socialLinks;
  if (!links || !Object.values(links).some(Boolean)) return null;

  const entries = (['facebook', 'instagram', 'whatsapp', 'twitter'] as const).filter(
    (k) => links[k]
  );

  return (
    <section
      style={{
        padding: '32px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Group justify="center" gap="lg">
        {entries.map((key) => {
          const href = links[key];
          if (!href) return null;
          const Icon = ICONS[key];
          const url =
            key === 'whatsapp' && !href.startsWith('http')
              ? `https://wa.me/${href.replace(/\D/g, '')}`
              : href;
          return (
            <Anchor
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.colors.primary }}
              aria-label={key}
            >
              <Icon size={28} style={{ display: 'block' }} />
            </Anchor>
          );
        })}
      </Group>
    </section>
  );
}
