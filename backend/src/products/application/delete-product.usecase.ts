import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IProductRepository } from '../domain/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async execute(id: string, storeId: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product || product.storeId !== storeId) {
      throw new ForbiddenException('Produit non trouvé');
    }
    const hasOrders = await this.productRepository.hasOrderItems(id);
    if (hasOrders) {
      throw new ForbiddenException(
        'Impossible de supprimer : ce produit a des commandes associées. Archivez-le à la place.',
      );
    }
    await this.productRepository.delete(id);
  }
}
