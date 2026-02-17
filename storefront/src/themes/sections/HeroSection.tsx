'use client';

import { Container, Title, Text, Button } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../ThemeContext';

const HEIGHT_MAP = { small: 320, medium: 400, large: 520 };

export function HeroSection() {
  const { theme, basePath } = useTheme();
  const { heroTitle, heroSubtitle, heroCta, heroCtaHref, heroImage, colors, heroAlignment, heroHeight } = theme;
  const align = heroAlignment ?? 'center';
  const minHeight = HEIGHT_MAP[heroHeight ?? 'medium'];

  return (
    <section
      style={{
        position: 'relative',
        color: 'white',
        padding: '80px 0',
        textAlign: align,
        overflow: 'hidden',
        minHeight,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {heroImage ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              unoptimized={heroImage.startsWith('data:')}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.secondary}99 50%, ${colors.accent}99 100%)`,
              zIndex: 1,
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <Container size="md" style={{ position: 'relative', zIndex: 3, marginLeft: align === 'left' ? 0 : undefined, marginRight: align === 'right' ? 0 : 'auto' }}>
        <Title order={1} size={48} fw={700} mb="md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          {heroTitle}
        </Title>
        <Text size="lg" opacity={0.95} mb="xl" maw={600} mx={align === 'center' ? 'auto' : undefined} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
          {heroSubtitle}
        </Text>
        {heroCta && (
          <Button
            component={Link}
            href={heroCtaHref ? (heroCtaHref.startsWith('http') ? heroCtaHref : `${basePath}${heroCtaHref.startsWith('/') ? '' : '/'}${heroCtaHref}`) : `${basePath}/collections/all`}
            variant="white"
            color="dark"
            size="lg"
            radius="xl"
            target={heroCtaHref?.startsWith('http') ? '_blank' : undefined}
            rel={heroCtaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {heroCta}
          </Button>
        )}
      </Container>
    </section>
  );
}
