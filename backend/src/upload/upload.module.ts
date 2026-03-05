import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
