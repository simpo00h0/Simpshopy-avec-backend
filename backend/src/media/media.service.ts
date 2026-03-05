import { Injectable } from '@nestjs/common';
import { CreateMediaUseCase } from './application/create-media.usecase';
import { FindMediaByStoreUseCase } from './application/find-media-by-store.usecase';
import { DeleteMediaUseCase } from './application/delete-media.usecase';
import { Media } from './domain/media.entity';

@Injectable()
export class MediaService {
  constructor(
    private createMediaUseCase: CreateMediaUseCase,
    private findMediaByStoreUseCase: FindMediaByStoreUseCase,
    private deleteMediaUseCase: DeleteMediaUseCase,
  ) {}

  async upload(
    storeId: string,
    file: Express.Multer.File,
    altText?: string,
  ): Promise<Media> {
    return this.createMediaUseCase.execute({ file, storeId, altText });
  }

  async findByStore(
    storeId: string,
    limit?: number,
    offset?: number,
  ): Promise<Media[]> {
    return this.findMediaByStoreUseCase.execute(storeId, limit, offset);
  }

  async delete(id: string, storeId: string): Promise<void> {
    return this.deleteMediaUseCase.execute(id, storeId);
  }
}
