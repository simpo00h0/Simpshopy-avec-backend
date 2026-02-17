'use client';

import { Stack, Text } from '@mantine/core';
import type { BlockSettingsProps } from '../../editor-types';

export function BlockHeaderPlaceholder(_props: BlockSettingsProps) {
  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        Ajoutez le bloc « Logo & favicon » depuis la bibliothèque (glissez-déposez en bas du canvas) pour configurer le logo et le favicon.
      </Text>
    </Stack>
  );
}
