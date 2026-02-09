import { Injectable, Inject } from '@nestjs/common';
import {
  IPageRepository,
} from '../domain/page.repository';
import { Page } from '../domain/page.entity';

@Injectable()
export class RestorePageVersionUseCase {
  constructor(
    @Inject('IPageRepository')
    private pageRepository: IPageRepository,
  ) {}

  async execute(pageId: string, version: number): Promise<Page> {
    const versionData = await this.pageRepository.findVersionByPageAndVersion(
      pageId,
      version,
    );

    if (!versionData) {
      throw new Error('Version introuvable');
    }

    await this.pageRepository.createVersion(
      pageId,
      versionData.content,
      `Restauration version ${version}`,
    );

    const page = await this.pageRepository.update({
      id: pageId,
      content: versionData.content,
    });

    return page;
  }
}
