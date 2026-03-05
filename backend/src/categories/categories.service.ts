import { Injectable, Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  CategorySummary,
} from './domain/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async findByStore(storeId: string): Promise<CategorySummary[]> {
    return this.categoryRepository.findByStore(storeId);
  }
}
