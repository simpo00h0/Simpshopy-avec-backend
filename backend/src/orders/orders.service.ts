import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ConfirmPaymentUseCase } from './application/confirm-payment.usecase';
import { CreateOrderInput, Order } from './domain/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    return this.createOrderUseCase.execute(input);
  }

  async confirmPayment(orderId: string, paymentId: string): Promise<void> {
    return this.confirmPaymentUseCase.execute(orderId, paymentId);
  }
}
