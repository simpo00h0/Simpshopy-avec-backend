import { Injectable, Inject } from '@nestjs/common';
import { IMediaRepository } from '../domain/media.repository';
import { Media } from '../domain/media.entity';

@Injectable()
export class FindMediaByStoreUseCase {
  constructor(
    @Inject('IMediaRepository')
    private mediaRepository: IMediaRepository,
  ) {}

  async execute(
    storeId: string,
    limit = 50,
    offset = 0,
  ): Promise<Media[]> {
    return this.mediaRepository.findByStore(storeId, limit, offset);
  }
}
