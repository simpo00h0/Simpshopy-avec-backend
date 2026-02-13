export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  inventoryQty: number;
  sku?: string | null;
  status: string;
  storeId: string;
  category?: unknown;
  variants?: unknown[];
}
