'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Stack, Group, Box, Paper, Text, UnstyledButton } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

const pad = (n: number) => String(n).padStart(2, '0');

function formatDisplay(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseIso(iso: string | undefined): { date: Date | null; time: string } {
  if (!iso) return { date: null, time: '23:59' };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: null, time: '23:59' };
  return { date: d, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

function toIso(date: Date | null, time: string): string {
  if (!date) return '';
  const [h = '23', m = '59'] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  return d.toISOString();
}

interface CountdownDateTimeModalProps {
  value: string;
  onChange: (iso: string) => void;
  label?: string;
  placeholder?: string;
}

export function CountdownDateTimeModal({
  value,
  onChange,
  label = "Date et heure de fin",
  placeholder = "Choisir la date et l'heure",
}: CountdownDateTimeModalProps) {
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('23:59');

  const handleOpen = useCallback(() => {
    const { date: d, time: t } = parseIso(value);
    setDate(d);
    setTime(t);
    setOpened(true);
  }, [value]);

  const handleClose = useCallback(() => setOpened(false), []);

  const handleConfirm = useCallback(() => {
    onChange(toIso(date, time));
    setOpened(false);
  }, [date, time, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setDate(null);
    setTime('23:59');
    setOpened(false);
  }, [onChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (opened) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [opened, handleClose]);

  const displayValue = formatDisplay(value);

  const modalContent = opened && typeof document !== 'undefined' && createPortal(
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="countdown-datetime-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        pointerEvents: 'auto',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={handleClose}
        aria-hidden
      />
      <Paper
        id="countdown-datetime-dialog"
        shadow="lg"
        p="md"
        radius="md"
        withBorder
        style={{
          position: 'relative',
          zIndex: 10001,
          maxWidth: 360,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Text id="countdown-datetime-title" size="sm" fw={600} mb="md">
          {label}
        </Text>
        <Stack gap="md">
          <DatePicker value={date} onChange={setDate} allowDeselect />
          <TimeInput
            label="Heure"
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
          />
          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" color="gray" onClick={handleClear}>
              Effacer
            </Button>
            <Button onClick={handleConfirm} disabled={!date}>
              Valider
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Box>,
    document.body
  );

  return (
    <Box>
      <Text size="sm" fw={500} mb={4} component="label">
        {label}
      </Text>
      <UnstyledButton
        type="button"
        onClick={handleOpen}
        style={{
          display: 'block',
          width: '100%',
          cursor: 'pointer',
          borderRadius: 'var(--mantine-radius-sm)',
          border: '1px solid var(--mantine-color-default-border)',
          padding: '8px 12px',
          backgroundColor: 'var(--mantine-color-default)',
          fontSize: 'var(--mantine-font-size-sm)',
          textAlign: 'left',
          minHeight: 36,
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <IconCalendar size={16} style={{ flexShrink: 0, color: 'var(--mantine-color-dimmed)' }} />
          <Text size="sm" c={displayValue ? undefined : 'dimmed'}>
            {displayValue || placeholder}
          </Text>
        </Group>
      </UnstyledButton>
      {modalContent}
    </Box>
  );
}
