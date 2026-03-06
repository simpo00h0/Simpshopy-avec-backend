import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IProductRepository,
  CreateProductData,
  UpdateProductData,
} from '../domain/product.repository';
import { Product } from '../domain/product.entity';

function variantNameFromAttributes(attributes: Record<string, string>): string {
  return Object.values(attributes).filter(Boolean).join(' / ') || 'Default';
}

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

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
        categoryId: data.categoryId,
        productType: data.productType,
        images: data.images ?? [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status ?? 'DRAFT',
      },
    });
    if (data.variants && data.variants.length > 0) {
      await this.prisma.productVariant.createMany({
        data: data.variants.map((v) => ({
          productId: product.id,
          name: variantNameFromAttributes(v.attributes),
          attributes: v.attributes,
          price: v.price ?? null,
          inventoryQty: v.inventoryQty ?? 0,
          sku: v.sku ?? null,
        })),
      });
    }
    return this.findById(product.id) as Promise<Product>;
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
      include: {
        variants: { select: { id: true, name: true, attributes: true, price: true, inventoryQty: true, sku: true } },
        category: true,
      },
    });
    return product as Product | null;
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
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
          ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
          ...(data.productType !== undefined && { productType: data.productType }),
          ...(data.images != null && { images: data.images }),
          ...(data.metaTitle != null && { metaTitle: data.metaTitle }),
          ...(data.metaDescription != null && { metaDescription: data.metaDescription }),
        },
      });
      if (data.variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (data.variants.length > 0) {
          this.logger.log(
            `[Variantes] Création de ${data.variants.length} variante(s) pour produit ${id}`,
          );
          await tx.productVariant.createMany({
            data: data.variants.map((v) => ({
              productId: id,
              name: variantNameFromAttributes(v.attributes),
              attributes: v.attributes,
              price: v.price ?? null,
              inventoryQty: v.inventoryQty ?? 0,
              sku: v.sku ?? null,
            })),
          });
        }
      }
    });
    return this.findById(id) as Promise<Product>;
  }

  async hasOrderItems(productId: string): Promise<boolean> {
    const count = await this.prisma.orderItem.count({
      where: { productId },
    });
    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
