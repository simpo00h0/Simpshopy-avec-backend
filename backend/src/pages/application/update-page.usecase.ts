import { Injectable, Inject } from '@nestjs/common';
import {
  IPageRepository,
} from '../domain/page.repository';
import { UpdatePageInput, Page, PageVersion } from '../domain/page.entity';

@Injectable()
export class UpdatePageUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(
    input: UpdatePageInput,
    createVersion: boolean = true,
    note?: string,
  ): Promise<{ page: Page; version?: PageVersion }> {
    const existingPage = await this.pageRepository.findById(input.id);

    if (!existingPage) {
      throw new Error('Page introuvable');
    }

    if (createVersion && input.content) {
      const version = await this.pageRepository.createVersion(
        input.id,
        existingPage.content,
        note,
      );

      const page = await this.pageRepository.update(input);

      return { page, version };
    }

    const page = await this.pageRepository.update(input);

    return { page };
  }
}
