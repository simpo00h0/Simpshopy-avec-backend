import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class FindProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async execute(id: string, storeId: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product || product.storeId !== storeId) {
      throw new ForbiddenException('Produit non trouvé');
    }
    return product;
  }
}
