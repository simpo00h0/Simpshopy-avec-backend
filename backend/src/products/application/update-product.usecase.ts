import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import {
  IProductRepository,
  UpdateProductData,
} from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    storeId: string,
    data: UpdateProductData,
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product || product.storeId !== storeId) {
      throw new ForbiddenException('Produit non trouvé');
    }
    return this.productRepository.update(id, data);
  }
}
