import { Injectable, Inject } from '@nestjs/common';
import {
  IPageRepository,
} from '../domain/page.repository';
import { CreatePageInput, Page } from '../domain/page.entity';

@Injectable()
export class CreatePageUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(input: CreatePageInput): Promise<Page> {
    const existing = await this.pageRepository.findByStoreAndSlug(
      input.storeId,
      input.slug,
    );

    if (existing) {
      throw new Error('Une page avec ce slug existe déjà');
    }

    return this.pageRepository.create(input);
  }
}
