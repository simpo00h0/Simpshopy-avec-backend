import { Store, StorePublic, StoreCustomer } from './store.entity';

export interface CreateStoreData {
  name: string;
  subdomain: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  address?: string;
  description?: string;
  ownerId: string;
}

export interface UpdateStoreData {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateStoreSettingsData {
  enableMobileMoney?: boolean;
  enableCardPayment?: boolean;
  enableBankTransfer?: boolean;
  enableCashOnDelivery?: boolean;
  enableShipping?: boolean;
  freeShippingThreshold?: number;
  themeId?: string;
  themeCustomization?: object;
}

export interface IStoreRepository {
  findBySubdomain(subdomain: string): Promise<Store | null>;

  create(data: CreateStoreData): Promise<Store>;

  findByOwner(ownerId: string): Promise<Store[]>;

  findFirstByOwner(ownerId: string): Promise<Store | null>;

  findBySubdomainPublic(subdomain: string): Promise<StorePublic | null>;

  findById(id: string): Promise<Store | null>;

  findByIdMinimal(id: string): Promise<{ id: string; name: string; subdomain: string; email: string; status: string; ownerId: string } | null>;

  /** Store + themeCustomization en une requête (pour mise à jour partielle rapide). */
  findByIdForSettingsUpdate(
    id: string
  ): Promise<{ id: string; name: string; subdomain: string; email: string; status: string; ownerId: string; themeCustomization: object | null } | null>;

  getThemeCustomization(storeId: string): Promise<object | null>;

  update(id: string, data: UpdateStoreData): Promise<Store>;

  updateSettings(
    storeId: string,
    data: UpdateStoreSettingsData,
  ): Promise<{ themeId: string | null; themeCustomization: object | null }>;

  getCustomers(ownerId: string): Promise<StoreCustomer[]>;
}
