import { Injectable, Inject } from '@nestjs/common';
import { IPageRepository } from '../domain/page.repository';
import { PageVersion } from '../domain/page.entity';

@Injectable()
export class GetPageVersionsUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(pageId: string): Promise<PageVersion[]> {
    return this.pageRepository.findVersionsByPageId(pageId);
  }
}
