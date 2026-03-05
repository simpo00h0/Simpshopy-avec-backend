import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IMediaRepository,
  CreateMediaData,
} from '../domain/media.repository';
import { Media } from '../domain/media.entity';

@Injectable()
export class MediaRepository implements IMediaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMediaData): Promise<Media> {
    const media = await this.prisma.media.create({
      data: {
        storeId: data.storeId,
        url: data.url,
        imagekitFileId: data.imagekitFileId,
        filename: data.filename,
        mimeType: data.mimeType,
        size: data.size,
        altText: data.altText,
      },
    });
    return media as Media;
  }

  async findByStore(
    storeId: string,
    limit = 50,
    offset = 0,
  ): Promise<Media[]> {
    const items = await this.prisma.media.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return items as Media[];
  }

  async findById(id: string): Promise<Media | null> {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });
    return media as Media | null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.media.delete({
      where: { id },
    });
  }
}
