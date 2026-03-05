import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IMediaRepository } from '../domain/media.repository';

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject('IMediaRepository')
    private mediaRepository: IMediaRepository,
  ) {}

  async execute(id: string, storeId: string): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media || media.storeId !== storeId) {
      throw new ForbiddenException('Média non trouvé');
    }
    await this.mediaRepository.delete(id);
  }
}
