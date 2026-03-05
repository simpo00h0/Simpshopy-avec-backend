export interface Media {
  id: string;
  storeId: string;
  url: string;
  imagekitFileId: string | null;
  filename: string;
  mimeType: string;
  size: number | null;
  altText: string | null;
  createdAt: Date;
}
