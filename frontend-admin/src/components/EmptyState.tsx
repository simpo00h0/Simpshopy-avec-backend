'use client';

import { Card, Group, Text } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

type EmptyStateProps = {
  icon: Icon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Group justify="center" py={60}>
        <div style={{ textAlign: 'center' }}>
          <Icon size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
          <Text size="lg" fw={500} mt="md">
            {title}
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
          {action && <Group justify="center" mt="md">{action}</Group>}
        </div>
      </Group>
    </Card>
  );
}
