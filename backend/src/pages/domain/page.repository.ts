import { Page, PageVersion, CreatePageInput, UpdatePageInput } from './page.entity';

export interface ListPagesFilters {
  storeId?: string;
  isPublished?: boolean;
}

export interface IPageRepository {
  create(input: CreatePageInput): Promise<Page>;
  update(input: UpdatePageInput): Promise<Page>;
  findById(id: string): Promise<Page | null>;
  findByStoreAndSlug(storeId: string, slug: string): Promise<Page | null>;
  findMany(filters: ListPagesFilters): Promise<Page[]>;
  createVersion(pageId: string, content: unknown, note?: string): Promise<PageVersion>;
  findVersionsByPageId(pageId: string): Promise<PageVersion[]>;
  findVersionByPageAndVersion(pageId: string, version: number): Promise<PageVersion | null>;
}
