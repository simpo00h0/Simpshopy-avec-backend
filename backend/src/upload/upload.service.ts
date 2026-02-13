import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly imagekit: ImageKit | null = null;

  constructor(private readonly configService: ConfigService) {
    const privateKey = this.configService.get<string>('IMAGEKIT_PRIVATE_KEY');
    if (privateKey) {
      this.imagekit = new ImageKit({ privateKey });
    }
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    if (!this.imagekit) {
      throw new Error('ImageKit non configuré. Définissez IMAGEKIT_PRIVATE_KEY dans .env');
    }
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `simpshopy/${randomUUID()}.${ext}`;
    const uploadFile = await toFile(file.buffer, fileName);
    const response = await this.imagekit.files.upload({
      file: uploadFile,
      fileName,
    });
    if (!response.url) {
      throw new Error('ImageKit n\'a pas renvoyé l\'URL de l\'image');
    }
    return response.url;
  }
}
