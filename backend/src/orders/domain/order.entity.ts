export interface CreateOrderInput {
  storeId: string;
  customerId: string;
  items: OrderItemInput[];
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod: string;
  shippingZoneId?: string;
  shippingMethodId?: string;
  customerNote?: string;
}

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface Order {
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
}
