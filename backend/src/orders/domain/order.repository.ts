import { Order } from './order.entity';

export interface StoreSettingsForOrder {
  enableTaxes: boolean;
  taxRate: number | null;
}

export interface ShippingMethodForOrder {
  price: number;
}

export interface SaveOrderData {
  orderNumber: string;
  storeId: string;
  customerId: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  platformFeeAmount: number;
  total: number;
  shippingAddress: unknown;
  billingAddress?: unknown;
  paymentMethod?: string;
  shippingZoneId?: string;
  shippingMethodId?: string;
  customerNote?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export interface OrderForPayment {
  id: string;
  storeId: string;
  orderNumber: string;
  total: number;
  platformFeeAmount: number;
  paymentStatus: string;
}

export interface OrderListFilters {
  storeId?: string;
  customerId?: string;
  status?: string;
}

export interface OrderWithDetails {
  id: string;
  orderNumber: string;
  storeId: string;
  customerId: string;
  status: string;
  total: number;
  items: unknown[];
  store: { id: string; name: string; subdomain: string };
  customer?: { id: string; firstName: string; lastName: string; email: string };
}

export interface IOrderRepository {
  save(data: SaveOrderData): Promise<Order>;

  getStoreSettings(storeId: string): Promise<StoreSettingsForOrder | null>;

  getShippingMethodById(id: string): Promise<ShippingMethodForOrder | null>;

  findByIdForPayment(id: string): Promise<OrderForPayment | null>;

  updatePaymentStatus(
    orderId: string,
    paymentId: string,
  ): Promise<void>;

  findMany(filters: OrderListFilters): Promise<OrderWithDetails[]>;

  findByIdWithDetails(id: string): Promise<OrderWithDetails | null>;
}
