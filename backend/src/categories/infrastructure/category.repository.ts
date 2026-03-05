import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ICategoryRepository,
  CategorySummary,
} from '../domain/category.repository';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByStore(storeId: string): Promise<CategorySummary[]> {
    const categories = await this.prisma.category.findMany({
      where: { storeId },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    return categories as CategorySummary[];
  }
}
