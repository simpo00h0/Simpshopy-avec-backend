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

export async function uploadMediaToLibrary(file: File, altText?: string): Promise<Media | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const params = new URLSearchParams();
    if (altText) params.set('altText', altText);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    const { data } = await api.post<Media>(`/media/upload${suffix}`, formData);
    const fullUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE_URL}${data.url}`;
    return { ...data, url: fullUrl };
  } catch (err) {
    reportError(err, { context: 'media.upload' });
    return null;
  }
}
