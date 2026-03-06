export interface PendingUpload {
  id: string;
  file: File;
  blobUrl: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
}
