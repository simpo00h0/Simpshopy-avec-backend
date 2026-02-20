'use client';

import { useState, useEffect } from 'react';
import { Container, Text, Title } from '@mantine/core';
import { useTheme } from '../ThemeContext';
import { parseRemaining, SIZE_STYLES } from './countdown/countdown-utils';
import type { CountdownSize } from './countdown/countdown-utils';
import styles from './countdown/countdown.module.css';

const UNITS: { key: keyof { days: number; hours: number; min: number; sec: number }; label: string }[] = [
  { key: 'days', label: 'jours' },
  { key: 'hours', label: 'heures' },
  { key: 'min', label: 'min' },
  { key: 'sec', label: 'sec' },
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
            const unit = (
              <div key={key} className={styles.unit} aria-live="polite" aria-label={`${value} ${label}`}>
                <div className={styles.valueBox}>{value}</div>
                <span className={styles.label}>{label}</span>
              </div>
            );
            const sep = i < UNITS.length - 1 ? (
              <span key={`sep-${key}`} className={styles.separator} aria-hidden>:</span>
            ) : null;
            return sep ? [unit, sep] : [unit];
          })}
        </div>
      </Container>
    </section>
  );
}
