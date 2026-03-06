import { Injectable, Inject, ForbiddenException, Logger } from '@nestjs/common';
import {
  IProductRepository,
  UpdateProductData,
} from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class UpdateProductUseCase {
  private readonly logger = new Logger(UpdateProductUseCase.name);

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
    if (data.variants !== undefined) {
      this.logger.log(
        `[Variantes] Produit ${id}: ${data.variants.length} variante(s) à enregistrer`,
      );
    }
    return this.productRepository.update(id, data);
  }
}
