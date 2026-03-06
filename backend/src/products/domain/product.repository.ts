import { Product } from './product.entity';

export interface CreateVariantData {
  attributes: Record<string, string>;
  price?: number;
  inventoryQty?: number;
  sku?: string;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQty?: number;
  sku?: string;
  storeId: string;
  categoryId?: string;
  productType?: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  variants?: CreateVariantData[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  inventoryQty?: number;
  sku?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  categoryId?: string | null;
  productType?: string | null;
  images?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  variants?: CreateVariantData[];
}

export interface IProductRepository {
  findByStoreAndSlug(storeId: string, slug: string): Promise<Product | null>;

  create(data: CreateProductData): Promise<Product>;

  findByStore(storeId: string, status?: string): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;

  update(id: string, data: UpdateProductData): Promise<Product>;

  hasOrderItems(productId: string): Promise<boolean>;

  delete(id: string): Promise<void>;
}
