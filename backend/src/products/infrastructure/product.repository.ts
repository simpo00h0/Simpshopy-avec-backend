import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IProductRepository,
  CreateProductData,
  UpdateProductData,
} from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findByStoreAndSlug(
    storeId: string,
    slug: string,
  ): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { storeId_slug: { storeId, slug } },
    });
    return product as Product | null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        inventoryQty: data.inventoryQty ?? 0,
        sku: data.sku,
        storeId: data.storeId,
      },
    });
    return product as Product;
  }

  async findByStore(storeId: string, status?: string): Promise<Product[]> {
    const where: Record<string, unknown> = { storeId };
    if (
      status &&
      ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'].includes(status)
    ) {
      where.status = status;
    }
    const products = await this.prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products as Product[];
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, category: true },
    });
    return product as Product | null;
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.description != null && { description: data.description }),
        ...(data.price != null && { price: data.price }),
        ...(data.compareAtPrice != null && {
          compareAtPrice: data.compareAtPrice,
        }),
        ...(data.inventoryQty != null && { inventoryQty: data.inventoryQty }),
        ...(data.sku != null && { sku: data.sku }),
        ...(data.status != null && { status: data.status }),
      },
    });
    return product as Product;
  }
}
