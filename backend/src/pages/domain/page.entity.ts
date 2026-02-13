export interface CreatePageInput {
  storeId: string;
  title: string;
  slug: string;
  content: unknown;
}

export interface UpdatePageInput {
  id: string;
  title?: string;
  content?: unknown;
  isPublished?: boolean;
}

export interface CreatePageVersionInput {
  pageId: string;
  content: unknown;
  note?: string;
}

export interface Page {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  content: unknown;
  isPublished: boolean;
  publishedAt?: Date;
}

export interface PageVersion {
  id: string;
  pageId: string;
  content: unknown;
  version: number;
  note?: string;
  createdAt: Date;
}
