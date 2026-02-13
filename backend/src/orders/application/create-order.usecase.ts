import { Injectable, Inject } from '@nestjs/common';
import { CommissionsService } from '../../commissions/commissions.service';
import { EventsService } from '../../events/events.service';
import { IOrderRepository } from '../domain/order.repository';
import { CreateOrderInput, Order } from '../domain/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private orderRepository: IOrderRepository,
    private commissionsService: CommissionsService,
    private eventsService: EventsService,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();

    const { subtotal, items } = this.calculateSubtotal(input.items);

    const taxAmount = await this.calculateTax(input.storeId, subtotal);

    const shippingAmount = await this.calculateShipping(input.shippingMethodId);

    const { commission } = await this.calculateCommission(
      input.storeId,
      subtotal,
    );

    const total = this.calculateTotal(
      subtotal,
      taxAmount,
      shippingAmount,
      0,
      commission,
    );

    const order = await this.orderRepository.save({
      orderNumber,
      storeId: input.storeId,
      customerId: input.customerId,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount: 0,
      platformFeeAmount: commission,
      total,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddress,
      paymentMethod: input.paymentMethod,
      shippingZoneId: input.shippingZoneId,
      shippingMethodId: input.shippingMethodId,
      customerNote: input.customerNote,
      items,
    });

    await this.eventsService.logOrderCreated(
      order.id,
      input.storeId,
      input.customerId,
    );

    return order;
  }

  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  private calculateSubtotal(items: CreateOrderInput['items']) {
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const price = item.price * item.quantity;
      subtotal += price;
      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        total: price,
      };
    });
    return { subtotal, items: orderItems };
  }

  private async calculateTax(storeId: string, subtotal: number): Promise<number> {
    const settings =
      await this.orderRepository.getStoreSettings(storeId);

    if (!settings?.enableTaxes || !settings.taxRate) {
      return 0;
    }

    return subtotal * (settings.taxRate / 100);
  }

  private async calculateShipping(methodId?: string): Promise<number> {
    if (!methodId) return 0;

    const method =
      await this.orderRepository.getShippingMethodById(methodId);

    return method?.price ?? 0;
  }

  private async calculateCommission(storeId: string, amount: number) {
    const result = await this.commissionsService.calculateCommission({
      storeId,
      amount,
      appliesTo: 'order',
    });

    return { commission: result.amount };
  }

  private calculateTotal(
    subtotal: number,
    tax: number,
    shipping: number,
    discount: number,
    commission: number,
  ): number {
    return subtotal + tax + shipping - discount + commission;
  }
}
