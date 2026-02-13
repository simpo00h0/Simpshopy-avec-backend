import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPageRepository } from '../domain/page.repository';
import { Page } from '../domain/page.entity';

@Injectable()
export class GetPageUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(id: string): Promise<Page> {
    const page = await this.pageRepository.findById(id);

    if (!page) {
      throw new NotFoundException('Page non trouvée');
    }

    return page;
  }
}
