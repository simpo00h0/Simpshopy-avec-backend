import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './presentation/categories.controller';
import { CategoryRepository } from './infrastructure/category.repository';
import { ICategoryRepository } from './domain/category.repository';
import { AuthModule } from '../auth/auth.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [AuthModule, StoresModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoryRepository,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
