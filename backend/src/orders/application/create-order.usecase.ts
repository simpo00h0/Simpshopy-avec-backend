import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionsService } from '../../commissions/commissions.service';
import { EventsService } from '../../events/events.service';
import { CreateOrderInput, Order } from '../domain/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private prisma: PrismaService,
    private commissionsService: CommissionsService,
    private eventsService: EventsService,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();

    const { subtotal, items } = await this.calculateSubtotal(input.items);

    const taxAmount = await this.calculateTax(input.storeId, subtotal);

    const shippingAmount = await this.calculateShipping(
      input.storeId,
      input.shippingZoneId,
      input.shippingMethodId,
    );

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

    const order = await this.createOrder(input, {
      orderNumber,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount: 0,
      platformFeeAmount: commission,
      total,
    });

    await this.eventsService.logOrderCreated(
      order.id,
      input.storeId,
      input.customerId,
    );

    return this.mapToEntity(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  private async calculateSubtotal(items: any[]) {
    let subtotal = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const price = item.price * item.quantity;
        subtotal += price;
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          total: price,
        };
      }),
    );

    return { subtotal, items: orderItems };
  }

  private async calculateTax(storeId: string, subtotal: number): Promise<number> {
    const settings = await this.prisma.storeSettings.findUnique({
      where: { storeId },
    });

    if (!settings?.enableTaxes || !settings.taxRate) {
      return 0;
    }

    return subtotal * (settings.taxRate / 100);
  }

  private async calculateShipping(
    storeId: string,
    zoneId?: string,
    methodId?: string,
  ): Promise<number> {
    if (!methodId) {
      return 0;
    }

    const method = await this.prisma.shippingMethod.findUnique({
      where: { id: methodId },
    });

    return method?.price || 0;
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

  private async createOrder(input: CreateOrderInput, totals: any) {
    return this.prisma.order.create({
      data: {
        orderNumber: totals.orderNumber,
        storeId: input.storeId,
        customerId: input.customerId,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        shippingAmount: totals.shippingAmount,
        discountAmount: totals.discountAmount,
        platformFeeAmount: totals.platformFeeAmount,
        total: totals.total,
        currency: 'XOF',
        status: 'PENDING',
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        paymentMethod: input.paymentMethod as any,
        shippingZoneId: input.shippingZoneId,
        shippingMethodId: input.shippingMethodId,
        customerNote: input.customerNote,
        items: {
          create: totals.items,
        },
      },
      include: { items: true },
    });
  }

  private mapToEntity(order: any): Order {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      storeId: order.storeId,
      customerId: order.customerId,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      discountAmount: order.discountAmount,
      platformFeeAmount: order.platformFeeAmount,
      total: order.total,
      currency: order.currency,
      status: order.status,
    };
  }
}
