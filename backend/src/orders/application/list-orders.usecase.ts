import { Injectable, Inject } from '@nestjs/common';
import {
  IOrderRepository,
  OrderListFilters,
  OrderWithDetails,
} from '../domain/order.repository';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject('IOrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  async execute(filters: OrderListFilters): Promise<OrderWithDetails[]> {
    return this.orderRepository.findMany(filters);
  }
}
