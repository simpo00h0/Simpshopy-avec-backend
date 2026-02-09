'use client';

import { Container, Group, Button } from '@mantine/core';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';

export function CtaButtonsSection() {
  const { theme, basePath } = useTheme();
  const cta = theme.ctaButtons;
  if (!cta?.primaryText || !cta?.primaryHref) return null;

  const primaryHref = cta.primaryHref.startsWith('http')
    ? cta.primaryHref
    : `${basePath}${cta.primaryHref.startsWith('/') ? '' : '/'}${cta.primaryHref}`;
  const secondaryHref = cta.secondaryHref
    ? cta.secondaryHref.startsWith('http')
      ? cta.secondaryHref
      : `${basePath}${cta.secondaryHref.startsWith('/') ? '' : '/'}${cta.secondaryHref}`
    : undefined;

  return (
    <section
      style={{
        padding: '40px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="sm">
        <Group justify="center" gap="md" wrap="wrap">
          <Button
            component={Link}
            href={primaryHref}
            variant="filled"
            size="lg"
            style={{ backgroundColor: theme.colors.primary }}
            target={cta.primaryHref.startsWith('http') ? '_blank' : undefined}
            rel={cta.primaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {cta.primaryText}
          </Button>
          {cta.secondaryText && secondaryHref && (
            <Button
              component={Link}
              href={secondaryHref}
              variant="outline"
              size="lg"
              style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
              target={cta.secondaryHref.startsWith('http') ? '_blank' : undefined}
              rel={cta.secondaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {cta.secondaryText}
            </Button>
          )}
        </Group>
      </Container>
    </section>
  );
}
