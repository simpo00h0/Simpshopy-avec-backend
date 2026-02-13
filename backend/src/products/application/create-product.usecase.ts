import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository, CreateProductData } from '../domain/product.repository';
import { Product } from '../domain/product.entity';
import { ProductPolicy } from '../domain/product.policy';

export interface CreateProductInput
  extends Omit<CreateProductData, 'slug' | 'storeId'> {
  slug?: string;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async execute(storeId: string, input: CreateProductInput): Promise<Product> {
    const slug = input.slug?.trim() || ProductPolicy.slugify(input.name);

    const existing = await this.productRepository.findByStoreAndSlug(
      storeId,
      slug,
    );
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    return this.productRepository.create({
      ...input,
      slug: finalSlug,
      storeId,
      inventoryQty: input.inventoryQty ?? 0,
    });
  }
}
