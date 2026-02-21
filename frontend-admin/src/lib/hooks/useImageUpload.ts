'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { uploadImage } from '../upload-service';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Lecture impossible'));
    reader.readAsDataURL(file);
  });
}

export interface UseImageUploadOptions {
  onUpdate: (url: string) => void;
  successTitle?: string;
  successMessage?: string;
  onError?: () => void;
}

export function useImageUpload({
  onUpdate,
  successTitle = 'Image importée',
  successMessage = '',
  onError,
}: UseImageUploadOptions) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    onUpdate(dataUrl);
    setLoading(true);
    const result = await uploadImage(file);
    setLoading(false);
    if (result.success && result.url) {
      onUpdate(result.url);
      notifications.show({ title: successTitle, message: successMessage, color: 'green' });
    } else {
      onUpdate('');
      onError?.();
    }
  };

  return { handleDrop, loading };
}
