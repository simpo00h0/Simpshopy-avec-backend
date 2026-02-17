'use client';

import { Container, Title, Text, Button, Grid, Box } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';

export function ImageTextSection() {
  const { theme, basePath, isEditor } = useTheme();
  const section = theme.imageTextSection;
  if (!section?.imageUrl && !section?.title && !section?.content) {
    if (isEditor) {
      return (
        <section style={{ padding: '32px 0', backgroundColor: theme.colors.bg }}>
          <Container size="sm">
            <Text size="sm" ta="center" c="dimmed">Ajoutez une image, un titre ou du contenu dans le panneau Paramètres.</Text>
          </Container>
        </section>
      );
    }
    return null;
  }

  const isLeft = section.position === 'left';

  return (
    <section
      style={{
        padding: '56px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="lg">
        <Grid gutter="xl" align="center">
          <Grid.Col span={{ base: 12, md: 6 }} order={isLeft ? 1 : 2}>
            {section.imageUrl && (
              <Box
                style={{
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src={section.imageUrl}
                  alt={section.title ?? ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={isLeft ? 2 : 1}>
            {section.title && (
              <Title order={2} mb="sm" style={{ color: theme.colors.text }}>
                {section.title}
              </Title>
            )}
            {section.content && (
              <Text size="md" c="dimmed" mb={section.ctaText ? 'md' : 0} style={{ color: theme.colors.text, opacity: 0.9 }}>
                {section.content}
              </Text>
            )}
            {section.ctaText && section.ctaHref && (
              <Button
                component={Link}
                href={section.ctaHref.startsWith('http') ? section.ctaHref : `${basePath}${section.ctaHref.startsWith('/') ? '' : '/'}${section.ctaHref}`}
                variant="filled"
                color={theme.colors.primary}
                size="md"
                target={section.ctaHref.startsWith('http') ? '_blank' : undefined}
                rel={section.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {section.ctaText}
              </Button>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
}
