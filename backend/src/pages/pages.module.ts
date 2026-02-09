import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { CreatePageUseCase } from './application/create-page.usecase';
import { UpdatePageUseCase } from './application/update-page.usecase';
import { RestorePageVersionUseCase } from './application/restore-page-version.usecase';
import { PageRepository } from './infrastructure/page.repository';
import { IPageRepository } from './domain/page.repository';

@Module({
  imports: [AuthModule],
  controllers: [PagesController],
  providers: [
    PagesService,
    CreatePageUseCase,
    UpdatePageUseCase,
    RestorePageVersionUseCase,
    {
      provide: 'IPageRepository',
      useClass: PageRepository,
    },
  ],
  exports: [PagesService],
})
export class PagesModule {}
