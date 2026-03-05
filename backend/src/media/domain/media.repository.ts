import { Media } from './media.entity';

export interface CreateMediaData {
  storeId: string;
  url: string;
  imagekitFileId?: string;
  filename: string;
  mimeType: string;
  size?: number;
  altText?: string;
}

export interface IMediaRepository {
  create(data: CreateMediaData): Promise<Media>;
  findByStore(storeId: string, limit?: number, offset?: number): Promise<Media[]>;
  findById(id: string): Promise<Media | null>;
  delete(id: string): Promise<void>;
}
