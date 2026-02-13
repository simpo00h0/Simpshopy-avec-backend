import { Injectable, Inject } from '@nestjs/common';
import { IPageRepository, ListPagesFilters } from '../domain/page.repository';
import { Page } from '../domain/page.entity';

@Injectable()
export class ListPagesUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(filters: ListPagesFilters): Promise<Page[]> {
    return this.pageRepository.findMany(filters);
  }
}
