import { Page, PageVersion, CreatePageInput, UpdatePageInput } from './page.entity';

export interface IPageRepository {
  create(input: CreatePageInput): Promise<Page>;
  update(input: UpdatePageInput): Promise<Page>;
  findById(id: string): Promise<Page | null>;
  findByStoreAndSlug(storeId: string, slug: string): Promise<Page | null>;
  createVersion(pageId: string, content: any, note?: string): Promise<PageVersion>;
  findVersionsByPageId(pageId: string): Promise<PageVersion[]>;
  findVersionByPageAndVersion(pageId: string, version: number): Promise<PageVersion | null>;
}
