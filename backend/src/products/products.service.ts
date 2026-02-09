import { Injectable, ForbiddenException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'produit';
  }

  async create(storeId: string, dto: CreateProductDto) {
    const slug = dto.slug?.trim() || this.slugify(dto.name);
    const existing = await this.prisma.product.findUnique({
      where: { storeId_slug: { storeId, slug } },
    });
    if (existing) {
      const slugWithSuffix = `${slug}-${Date.now().toString(36)}`;
      return this.prisma.product.create({
        data: {
          name: dto.name,
          slug: slugWithSuffix,
          description: dto.description,
          price: dto.price,
          compareAtPrice: dto.compareAtPrice,
          inventoryQty: dto.inventoryQty ?? 0,
          sku: dto.sku,
          storeId,
        },
      });
    }
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        inventoryQty: dto.inventoryQty ?? 0,
        sku: dto.sku,
        storeId,
      },
    });
  }

  async findByStore(storeId: string, status?: string) {
    const where: { storeId: string; status?: ProductStatus } = { storeId };
    if (status && ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'].includes(status)) {
      where.status = status as ProductStatus;
    }
    return this.prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, storeId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, category: true },
    });
    if (!product || product.storeId !== storeId) {
      throw new ForbiddenException('Produit non trouvé');
    }
    return product;
  }

  async update(id: string, storeId: string, data: Record<string, unknown>) {
    const product = await this.findOne(id, storeId);
    return this.prisma.product.update({
      where: { id: product.id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.description != null && { description: data.description }),
        ...(data.price != null && { price: data.price }),
        ...(data.compareAtPrice != null && { compareAtPrice: data.compareAtPrice }),
        ...(data.inventoryQty != null && { inventoryQty: data.inventoryQty }),
        ...(data.sku != null && { sku: data.sku }),
        ...(data.status != null && { status: data.status as 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED' }),
      },
    });
  }
}
