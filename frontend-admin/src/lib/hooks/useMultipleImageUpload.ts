'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { uploadMediaToLibrary } from '../upload-service';

export interface UseMultipleImageUploadOptions {
  onAdd: (url: string) => void;
  successTitle?: string;
  maxFiles?: number;
}

export function useMultipleImageUpload({
  onAdd,
  successTitle = 'Image ajoutée à la bibliothèque',
  maxFiles = 10,
}: UseMultipleImageUploadOptions) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    setLoading(true);
    let added = 0;
    for (const file of files.slice(0, maxFiles)) {
      const media = await uploadMediaToLibrary(file);
      if (media?.url) {
        onAdd(media.url);
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
