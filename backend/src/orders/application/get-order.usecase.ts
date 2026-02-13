import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IOrderRepository,
  OrderWithDetails,
} from '../domain/order.repository';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  async execute(id: string): Promise<OrderWithDetails> {
    const order = await this.orderRepository.findByIdWithDetails(id);

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return order;
  }
}
