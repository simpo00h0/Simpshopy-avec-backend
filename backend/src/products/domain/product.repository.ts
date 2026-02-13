import { Product } from './product.entity';

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQty?: number;
  sku?: string;
  storeId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  inventoryQty?: number;
  sku?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
}

export interface IProductRepository {
  findByStoreAndSlug(storeId: string, slug: string): Promise<Product | null>;

  create(data: CreateProductData): Promise<Product>;

  findByStore(storeId: string, status?: string): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;

  update(id: string, data: UpdateProductData): Promise<Product>;
}
