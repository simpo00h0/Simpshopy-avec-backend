import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoresService } from '../stores.service';

@ApiTags('storefront')
@Controller('storefront')
export class StoresPublicController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':subdomain')
  @ApiOperation({
    summary: "Données publiques d'une boutique (par sous-domaine)",
  })
  async findBySubdomain(@Param('subdomain') subdomain: string) {
    const store = await this.storesService.findBySubdomainPublic(subdomain);
    if (!store) {
      throw new NotFoundException('Boutique introuvable');
    }
    return store;
  }
}
