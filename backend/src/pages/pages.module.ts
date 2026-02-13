import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoresModule } from '../stores/stores.module';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { CreatePageUseCase } from './application/create-page.usecase';
import { UpdatePageUseCase } from './application/update-page.usecase';
import { RestorePageVersionUseCase } from './application/restore-page-version.usecase';
import { ListPagesUseCase } from './application/list-pages.usecase';
import { GetPageUseCase } from './application/get-page.usecase';
import { GetPageVersionsUseCase } from './application/get-page-versions.usecase';
import { PageRepository } from './infrastructure/page.repository';
import { IPageRepository } from './domain/page.repository';

@Module({
  imports: [AuthModule, StoresModule],
  controllers: [PagesController],
  providers: [
    PagesService,
    CreatePageUseCase,
    UpdatePageUseCase,
    RestorePageVersionUseCase,
    ListPagesUseCase,
    GetPageUseCase,
    GetPageVersionsUseCase,
    {
      provide: 'IPageRepository',
      useClass: PageRepository,
    },
  ],
  exports: [PagesService],
})
export class PagesModule {}
