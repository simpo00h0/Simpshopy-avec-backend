import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoresModule } from '../stores/stores.module';
import { UploadModule } from '../upload/upload.module';
import { MediaService } from './media.service';
import { MediaController } from './presentation/media.controller';
import { CreateMediaUseCase } from './application/create-media.usecase';
import { FindMediaByStoreUseCase } from './application/find-media-by-store.usecase';
import { DeleteMediaUseCase } from './application/delete-media.usecase';
import { MediaRepository } from './infrastructure/media.repository';
import { IMediaRepository } from './domain/media.repository';

@Module({
  imports: [AuthModule, StoresModule, UploadModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    CreateMediaUseCase,
    FindMediaByStoreUseCase,
    DeleteMediaUseCase,
    MediaRepository,
    {
      provide: 'IMediaRepository',
      useClass: MediaRepository,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
