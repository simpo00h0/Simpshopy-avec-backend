import { api, UPLOAD_BASE_URL } from './api';
import { reportError } from './error-handler';

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
  altText?: string;
  createdAt: string;
}

export interface UploadProgressOptions {
  onProgress?: (percent: number) => void;
}

export async function uploadMediaToLibrary(
  file: File,
  altText?: string,
  options?: UploadProgressOptions
): Promise<Media | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const params = new URLSearchParams();
    if (altText) params.set('altText', altText);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    const { data } = await api.post<Media>(`/media/upload${suffix}`, formData, {
      onUploadProgress: (e) => {
        if (e.total && e.total > 0 && options?.onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress(Math.min(percent, 99));
        }
      },
    });
    options?.onProgress?.(100);
    const fullUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE_URL}${data.url}`;
    return { ...data, url: fullUrl };
  } catch (err) {
    reportError(err, { context: 'media.upload' });
    return null;
  }
}
