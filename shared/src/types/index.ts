// Types partagés entre frontend et backend

export type { ThemeCustomization } from './theme-customization';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  avatar?: string;
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  ownerId: string;
  email: string;
  phone: string;
  currency: string;
  language: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  storeId: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  currency: string;
  customerId: string;
  storeId: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING_PAYMENT';
  price: number;
  currency: string;
  maxProducts?: number;
  maxOrders?: number;
}
