'use client';

import { useState, useEffect } from 'react';
import { Container, Text, Title } from '@mantine/core';
import { useTheme } from '../ThemeContext';
import { parseRemaining, SIZE_STYLES, type CountdownSize } from './countdown/countdown-utils';
import styles from './countdown/countdown.module.css';

const UNITS = [
  { key: 'days' as const, label: 'jours' },
  { key: 'hours' as const, label: 'heures' },
  { key: 'min' as const, label: 'min' },
  { key: 'sec' as const, label: 'sec' },
];

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
            <Text size="sm" ta="center" c="white" opacity={0.9}>
              Choisissez une date et heure de fin dans le panneau Paramètres.
            </Text>
          </Container>
        </section>
      );
    }
    return null;
  }
  if (!remaining) return null;

  const isFinished = remaining.days === 0 && remaining.hours === 0 && remaining.min === 0 && remaining.sec === 0;
  const size = (section.size as CountdownSize) ?? 'grand';
  const style = (section.style as string) ?? 'simple';
  const s = SIZE_STYLES[size];

  if (isFinished) {
    return (
      <section style={{ padding: s.padding, backgroundColor: theme.colors.primary, color: 'white' }}>
        <Container size="sm">
          <Text ta="center" fw={600}>
            L&apos;offre est terminée
          </Text>
        </Container>
      </section>
    );
  }

  return (
    <section
      data-style={style}
      data-size={size}
      style={{ padding: s.padding, backgroundColor: theme.colors.primary, color: 'white' }}
    >
      <Container size="sm">
        {section.label && (
          <Title order={s.titleOrder} ta="center" mb="md" style={{ color: 'white' }}>
            {section.label}
          </Title>
        )}
        <div className={styles.grid} role="timer" aria-label="Temps restant">
          {UNITS.flatMap(({ key, label }, i) => {
            const value = String(remaining[key]).padStart(2, '0');
            return [
              <div key={key} className={styles.unit} aria-live="polite" aria-label={`${value} ${label}`}>
                <div className={styles.valueBox}>{value}</div>
                <span className={styles.label}>{label}</span>
              </div>,
              ...(i < UNITS.length - 1 ? [<span key={`s-${key}`} className={styles.separator} aria-hidden>:</span>] : []),
            ];
          })}
        </div>
      </Container>
    </section>
  );
}
