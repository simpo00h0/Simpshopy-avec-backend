import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ConfirmPaymentUseCase } from './application/confirm-payment.usecase';
import { ListOrdersUseCase } from './application/list-orders.usecase';
import { GetOrderUseCase } from './application/get-order.usecase';
import { CreateOrderInput, Order } from './domain/order.entity';
import { OrderListFilters, OrderWithDetails } from './domain/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private listOrdersUseCase: ListOrdersUseCase,
    private getOrderUseCase: GetOrderUseCase,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    return this.createOrderUseCase.execute(input);
  }

  async confirmPayment(orderId: string, paymentId: string): Promise<void> {
    return this.confirmPaymentUseCase.execute(orderId, paymentId);
  }

  async listOrders(filters: OrderListFilters): Promise<OrderWithDetails[]> {
    return this.listOrdersUseCase.execute(filters);
  }

  async getOrder(id: string): Promise<OrderWithDetails> {
    return this.getOrderUseCase.execute(id);
  }
}
