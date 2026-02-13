import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IPageRepository,
  ListPagesFilters,
} from '../domain/page.repository';
import {
  Page,
  PageVersion,
  CreatePageInput,
  UpdatePageInput,
} from '../domain/page.entity';

@Injectable()
export class PageRepository implements IPageRepository {
  constructor(private prisma: PrismaService) {}

  async create(input: CreatePageInput): Promise<Page> {
    const created = await this.prisma.page.create({
      data: {
        storeId: input.storeId,
        title: input.title,
        slug: input.slug,
        content: input.content as object,
        isPublished: false,
      },
    });

    return this.mapToEntity(created);
  }

  async update(input: UpdatePageInput): Promise<Page> {
    const data: Record<string, unknown> = {};
    if (input.title) data.title = input.title;
    if (input.content) data.content = input.content;
    if (input.isPublished !== undefined) {
      data.isPublished = input.isPublished;
      if (input.isPublished) {
        data.publishedAt = new Date();
      }
    }

    const updated = await this.prisma.page.update({
      where: { id: input.id },
      data,
    });

    return this.mapToEntity(updated);
  }

  async findById(id: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    return page ? this.mapToEntity(page) : null;
  }

  async findByStoreAndSlug(storeId: string, slug: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: {
        storeId_slug: { storeId, slug },
      },
    });

    return page ? this.mapToEntity(page) : null;
  }

  async findMany(filters: ListPagesFilters): Promise<Page[]> {
    const where: Record<string, unknown> = {};
    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;

    const pages = await this.prisma.page.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return pages.map((p) => this.mapToEntity(p));
  }

  async createVersion(
    pageId: string,
    content: unknown,
    note?: string,
  ): Promise<PageVersion> {
    const versions = await this.prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { version: 'desc' },
      take: 1,
    });

    const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;

    const created = await this.prisma.pageVersion.create({
      data: {
        pageId,
        content: content as object,
        version: nextVersion,
        note,
      },
    });

    return this.mapVersionToEntity(created);
  }

  async findVersionsByPageId(pageId: string): Promise<PageVersion[]> {
    const versions = await this.prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { version: 'desc' },
    });

    return versions.map((v) => this.mapVersionToEntity(v));
  }

  async findVersionByPageAndVersion(
    pageId: string,
    version: number,
  ): Promise<PageVersion | null> {
    const versionData = await this.prisma.pageVersion.findFirst({
      where: {
        pageId,
        version,
      },
    });

    return versionData ? this.mapVersionToEntity(versionData) : null;
  }

  private mapToEntity(page: {
    id: string;
    storeId: string;
    title: string;
    slug: string;
    content: unknown;
    isPublished: boolean;
    publishedAt?: Date | null;
  }): Page {
    return {
      id: page.id,
      storeId: page.storeId,
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      publishedAt: page.publishedAt ?? undefined,
    };
  }

  private mapVersionToEntity(version: {
    id: string;
    pageId: string;
    content: unknown;
    version: number;
    note?: string | null;
    createdAt: Date;
  }): PageVersion {
    return {
      id: version.id,
      pageId: version.pageId,
      content: version.content,
      version: version.version,
      note: version.note ?? undefined,
      createdAt: version.createdAt,
    };
  }
}
