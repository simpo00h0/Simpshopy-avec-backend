import { Injectable } from '@nestjs/common';
import { CreatePageUseCase } from './application/create-page.usecase';
import { UpdatePageUseCase } from './application/update-page.usecase';
import { RestorePageVersionUseCase } from './application/restore-page-version.usecase';
import {
  CreatePageInput,
  UpdatePageInput,
  Page,
  PageVersion,
} from './domain/page.entity';

@Injectable()
export class PagesService {
  constructor(
    private createPageUseCase: CreatePageUseCase,
    private updatePageUseCase: UpdatePageUseCase,
    private restorePageVersionUseCase: RestorePageVersionUseCase,
  ) {}

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
