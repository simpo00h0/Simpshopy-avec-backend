'use client';

import { Container, Title, Text } from '@mantine/core';
import { useTheme } from '../ThemeContext';

function getEmbedUrl(url: string): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

export function VideoSection() {
  const { theme, isEditor } = useTheme();
  const section = theme.videoSection;
  if (!section?.url) {
    if (isEditor) {
      return (
        <section style={{ padding: '32px 0', backgroundColor: theme.colors.bg }}>
          <Container size="sm">
            <Text size="sm" ta="center" c="dimmed">Ajoutez une URL vidéo (YouTube, Vimeo) dans le panneau Paramètres.</Text>
          </Container>
        </section>
      );
    }
    return null;
  }

  const embedUrl = getEmbedUrl(section.url);

  return (
    <section
      style={{
        padding: '48px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="lg">
        {section.title && (
          <Title order={2} mb="md" ta="center" style={{ color: theme.colors.text }}>
            {section.title}
          </Title>
        )}
        {embedUrl ? (
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <iframe
              src={embedUrl}
              title={section.title ?? 'Vidéo'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            src={section.url}
            controls
            style={{ width: '100%', borderRadius: 8, maxHeight: 500 }}
            title={section.title ?? 'Vidéo'}
          />
        )}
      </Container>
    </section>
  );
}
