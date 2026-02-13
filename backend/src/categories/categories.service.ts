import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from './domain/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}
}
