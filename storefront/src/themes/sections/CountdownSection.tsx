'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Group, Box } from '@mantine/core';
import { useTheme } from '../ThemeContext';

function parseRemaining(endDate: string): { days: number; hours: number; min: number; sec: number } | null {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (end <= now) return { days: 0, hours: 0, min: 0, sec: 0 };
  let diff = Math.floor((end - now) / 1000);
  const sec = diff % 60;
  diff = Math.floor(diff / 60);
  const min = diff % 60;
  diff = Math.floor(diff / 60);
  const hours = diff % 24;
  const days = Math.floor(diff / 24);
  return { days, hours, min, sec };
}

export function CountdownSection() {
  const { theme, isEditor } = useTheme();
  const section = theme.countdownSection;
  const [remaining, setRemaining] = useState<{ days: number; hours: number; min: number; sec: number } | null>(null);

  useEffect(() => {
    if (!section?.endDate) return;
    const tick = () => setRemaining(parseRemaining(section.endDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [section?.endDate]);

  if (!section?.endDate) {
    if (isEditor) {
      return (
        <section style={{ padding: '32px 0', backgroundColor: theme.colors.primary }}>
          <Container size="sm">
            <Text size="sm" ta="center" c="white" opacity={0.9}>Choisissez une date et heure de fin dans le panneau Paramètres.</Text>
          </Container>
        </section>
      );
    }
    return null;
  }
  if (!remaining) return null;

  const isFinished = remaining.days === 0 && remaining.hours === 0 && remaining.min === 0 && remaining.sec === 0;

  return (
    <section
      style={{
        padding: '40px 0',
        backgroundColor: theme.colors.primary,
        color: 'white',
      }}
    >
      <Container size="sm">
        {section.label && (
          <Title order={3} ta="center" mb="md" style={{ color: 'white' }}>
            {section.label}
          </Title>
        )}
        {isFinished ? (
          <Text ta="center" fw={600}>L&apos;offre est terminée</Text>
        ) : (
          <Group justify="center" gap="lg" wrap="wrap">
            <Box ta="center">
              <Text size="xl" fw={700} lh={1}>{String(remaining.days).padStart(2, '0')}</Text>
              <Text size="xs" opacity={0.9}>jours</Text>
            </Box>
            <Box ta="center">
              <Text size="xl" fw={700} lh={1}>{String(remaining.hours).padStart(2, '0')}</Text>
              <Text size="xs" opacity={0.9}>heures</Text>
            </Box>
            <Box ta="center">
              <Text size="xl" fw={700} lh={1}>{String(remaining.min).padStart(2, '0')}</Text>
              <Text size="xs" opacity={0.9}>min</Text>
            </Box>
            <Box ta="center">
              <Text size="xl" fw={700} lh={1}>{String(remaining.sec).padStart(2, '0')}</Text>
              <Text size="xs" opacity={0.9}>sec</Text>
            </Box>
          </Group>
        )}
      </Container>
    </section>
  );
}
