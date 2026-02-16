import { api, UPLOAD_BASE_URL } from './api';
import { reportError } from './error-handler';

export interface UploadImageResult {
  success: boolean;
  url?: string;
}

export async function uploadImage(file: File): Promise<UploadImageResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<{ url: string }>('/upload/image', formData);
    const fullUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE_URL}${data.url}`;
    return { success: true, url: fullUrl };
  } catch (err) {
    reportError(err, { context: 'upload.image' });
    return { success: false };
  }
}
