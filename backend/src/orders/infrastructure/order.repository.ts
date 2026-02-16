import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IOrderRepository,
  SaveOrderData,
  StoreSettingsForOrder,
  ShippingMethodForOrder,
  OrderForPayment,
  OrderListFilters,
  OrderWithDetails,
} from '../domain/order.repository';
import { Order } from '../domain/order.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async save(data: SaveOrderData): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        storeId: data.storeId,
        customerId: data.customerId,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        shippingAmount: data.shippingAmount,
        discountAmount: data.discountAmount,
        platformFeeAmount: data.platformFeeAmount,
        total: data.total,
        currency: 'XOF',
        status: 'PENDING',
        shippingAddress: data.shippingAddress as object,
        billingAddress: (data.billingAddress as object) ?? undefined,
        paymentMethod: data.paymentMethod as never,
        shippingZoneId: data.shippingZoneId,
        shippingMethodId: data.shippingMethodId,
        customerNote: data.customerNote,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });

    return this.mapToEntity(created);
  }

  async getStoreSettings(
    storeId: string,
  ): Promise<StoreSettingsForOrder | null> {
    const settings = await this.prisma.storeSettings.findUnique({
      where: { storeId },
    });

    if (!settings) return null;

    return {
      enableTaxes: settings.enableTaxes,
      taxRate: settings.taxRate,
    };
  }

  async getShippingMethodById(
    id: string,
  ): Promise<ShippingMethodForOrder | null> {
    const method = await this.prisma.shippingMethod.findUnique({
      where: { id },
    });

    if (!method) return null;

    return { price: method.price };
  }

  async findByIdForPayment(id: string): Promise<OrderForPayment | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) return null;

    return {
      id: order.id,
      storeId: order.storeId,
      orderNumber: order.orderNumber,
      total: order.total,
      platformFeeAmount: order.platformFeeAmount,
      paymentStatus: order.paymentStatus,
    };
  }

  async updatePaymentStatus(
    orderId: string,
    paymentId: string,
  ): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
        paymentId,
        status: 'CONFIRMED',
      },
    });
  }

  async findMany(filters: OrderListFilters): Promise<OrderWithDetails[]> {
    const where: Record<string, unknown> = {};
    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true, variant: true } },
        store: { select: { id: true, name: true, subdomain: true } },
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders as OrderWithDetails[];
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        store: true,
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return order as OrderWithDetails | null;
  }

  private mapToEntity(order: {
    id: string;
    orderNumber: string;
    storeId: string;
    customerId: string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    platformFeeAmount: number;
    total: number;
    currency: string;
    status: string;
  }): Order {
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
