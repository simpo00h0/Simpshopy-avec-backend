import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class FindProductsByStoreUseCase {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async execute(storeId: string, status?: string): Promise<Product[]> {
    return this.productRepository.findByStore(storeId, status);
  }
}
