import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoresService } from '../stores.service';

@ApiTags('storefront')
@Controller('storefront')
export class StoresPublicController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':slug')
  @ApiOperation({
    summary: "Données publiques d'une boutique (par slug/sous-domaine)",
  })
  async findBySlug(@Param('slug') slug: string) {
    const store = await this.storesService.findBySlugPublic(slug);
    if (!store) {
      throw new NotFoundException('Boutique introuvable');
    }
    return store;
  }
}
