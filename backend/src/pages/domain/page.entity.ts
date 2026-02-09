export interface CreatePageInput {
  storeId: string;
  title: string;
  slug: string;
  content: any;
}

export interface UpdatePageInput {
  id: string;
  title?: string;
  content?: any;
  isPublished?: boolean;
}

export interface CreatePageVersionInput {
  pageId: string;
  content: any;
  note?: string;
}

export interface Page {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  content: any;
  isPublished: boolean;
  publishedAt?: Date;
}

export interface PageVersion {
  id: string;
  pageId: string;
  content: any;
  version: number;
  note?: string;
  createdAt: Date;
}
