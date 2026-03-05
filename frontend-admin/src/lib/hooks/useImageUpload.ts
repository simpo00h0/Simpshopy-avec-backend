'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { uploadMediaToLibrary } from '../upload-service';

export interface UseImageUploadOptions {
  onUpdate: (url: string) => void;
  successTitle?: string;
  successMessage?: string;
  onError?: () => void;
}

export function useImageUpload({
  onUpdate,
  successTitle = 'Image ajoutée à la bibliothèque',
  successMessage = '',
  onError,
}: UseImageUploadOptions) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    const media = await uploadMediaToLibrary(file);
    setLoading(false);
    if (media?.url) {
      onUpdate(media.url);
      notifications.show({ title: successTitle, message: successMessage, color: 'green' });
    } else {
      onError?.();
    }
  };

  return { handleDrop, loading };
}
