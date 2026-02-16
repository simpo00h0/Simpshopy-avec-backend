export interface Store {
  id: string;
  name: string;
  subdomain: string;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  status: string;
  ownerId: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address?: string | null;
  wallet?: unknown;
  settings?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StorePublic {
  id: string;
  name: string;
  subdomain: string;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  email: string;
  phone: string;
  themeId: string;
  themeCustomization: object | null;
  products: unknown[];
}

export interface StoreCustomer {
  customer: { id: string; firstName: string; lastName: string; email: string };
  orders: number;
  total: number;
}
