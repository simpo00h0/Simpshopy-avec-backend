import { Injectable } from '@nestjs/common';
import { CreatePageUseCase } from './application/create-page.usecase';
import { UpdatePageUseCase } from './application/update-page.usecase';
import { RestorePageVersionUseCase } from './application/restore-page-version.usecase';
import { ListPagesUseCase } from './application/list-pages.usecase';
import { GetPageUseCase } from './application/get-page.usecase';
import { GetPageVersionsUseCase } from './application/get-page-versions.usecase';
import {
  CreatePageInput,
  UpdatePageInput,
  Page,
  PageVersion,
} from './domain/page.entity';
import { ListPagesFilters } from './domain/page.repository';

@Injectable()
export class PagesService {
  constructor(
    private createPageUseCase: CreatePageUseCase,
    private updatePageUseCase: UpdatePageUseCase,
    private restorePageVersionUseCase: RestorePageVersionUseCase,
    private listPagesUseCase: ListPagesUseCase,
    private getPageUseCase: GetPageUseCase,
    private getPageVersionsUseCase: GetPageVersionsUseCase,
  ) {}

  async listPages(filters: ListPagesFilters): Promise<Page[]> {
    return this.listPagesUseCase.execute(filters);
  }

  async getPage(id: string): Promise<Page> {
    return this.getPageUseCase.execute(id);
  }

  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    return this.getPageVersionsUseCase.execute(pageId);
  }

  async createPage(input: CreatePageInput): Promise<Page> {
    return this.createPageUseCase.execute(input);
  }

  async updatePage(
    input: UpdatePageInput,
    createVersion: boolean = true,
    note?: string,
  ): Promise<{ page: Page; version?: PageVersion }> {
    return this.updatePageUseCase.execute(input, createVersion, note);
  }

  async restoreVersion(pageId: string, version: number): Promise<Page> {
    return this.restorePageVersionUseCase.execute(pageId, version);
  }
}
