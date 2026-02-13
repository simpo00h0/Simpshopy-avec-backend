import { Injectable } from '@nestjs/common';
import { CreateProductUseCase } from './application/create-product.usecase';
import { FindProductsByStoreUseCase } from './application/find-products-by-store.usecase';
import { FindProductUseCase } from './application/find-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { CreateProductInput } from './application/create-product.usecase';
import { UpdateProductData } from './domain/product.repository';

@Injectable()
export class ProductsService {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private findProductsByStoreUseCase: FindProductsByStoreUseCase,
    private findProductUseCase: FindProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
  ) {}

  async create(storeId: string, dto: CreateProductInput) {
    return this.createProductUseCase.execute(storeId, dto);
  }

  async findByStore(storeId: string, status?: string) {
    return this.findProductsByStoreUseCase.execute(storeId, status);
  }

  async findOne(id: string, storeId: string) {
    return this.findProductUseCase.execute(id, storeId);
  }

  async update(id: string, storeId: string, data: UpdateProductData) {
    return this.updateProductUseCase.execute(id, storeId, data);
  }
}
