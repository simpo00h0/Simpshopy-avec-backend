'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { uploadImage } from '../upload-service';

export interface UseMultipleImageUploadOptions {
  onAdd: (url: string) => void;
  onRemove?: (url: string) => void;
  successTitle?: string;
  maxFiles?: number;
}

export function useMultipleImageUpload({
  onAdd,
  successTitle = 'Image importée',
  maxFiles = 10,
}: UseMultipleImageUploadOptions) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    setLoading(true);
    let added = 0;
    for (const file of files) {
      const result = await uploadImage(file);
      if (result.success && result.url) {
        onAdd(result.url);
        added++;
      }
    }
    setLoading(false);
    if (added > 0) {
      notifications.show({ title: successTitle, message: `${added} image(s) ajoutée(s)`, color: 'green' });
    }
  };

  return { handleDrop, loading };
}
