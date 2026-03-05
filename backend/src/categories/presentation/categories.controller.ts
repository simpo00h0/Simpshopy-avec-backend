import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { CategoriesService } from '../categories.service';
import { FindFirstStoreByOwnerUseCase } from '../../stores/application/find-first-store-by-owner.usecase';

@ApiTags('categories')
@Controller('categories')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste des catégories de la boutique' })
  async findAll(@Request() req: { user: { id: string } }): Promise<{ id: string; name: string; slug: string }[]> {
    const store = await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    return this.categoriesService.findByStore(store.id);
  }
}
