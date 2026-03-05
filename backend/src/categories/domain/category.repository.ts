export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ICategoryRepository {
  findByStore(storeId: string): Promise<CategorySummary[]>;
}
