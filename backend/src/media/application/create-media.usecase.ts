import { Injectable, Inject } from '@nestjs/common';
import { IMediaRepository } from '../domain/media.repository';
import { Media } from '../domain/media.entity';
import { UploadService } from '../../upload/upload.service';

export interface CreateMediaInput {
  file: Express.Multer.File;
  storeId: string;
  altText?: string;
}

@Injectable()
export class CreateMediaUseCase {
  constructor(
    @Inject('IMediaRepository')
    private mediaRepository: IMediaRepository,
    private uploadService: UploadService,
  ) {}

  async execute(input: CreateMediaInput): Promise<Media> {
    const { url, fileId } =
      await this.uploadService.saveImageWithMetadata(input.file);

    return this.mediaRepository.create({
      storeId: input.storeId,
      url,
      imagekitFileId: fileId,
      filename: input.file.originalname,
      mimeType: input.file.mimetype,
      size: input.file.size,
      altText: input.altText,
    });
  }
}
