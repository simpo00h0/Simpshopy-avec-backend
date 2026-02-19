import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FindStoreBySubdomainPublicUseCase } from '../application/find-store-by-subdomain-public.usecase';

@ApiTags('storefront')
@Controller('storefront')
export class StoresPublicController {
  constructor(
    private readonly findStoreBySubdomainPublicUseCase: FindStoreBySubdomainPublicUseCase,
  ) {}

  @Get(':subdomain')
  @ApiOperation({
    summary: "Données publiques d'une boutique (par sous-domaine)",
  })
  async findBySubdomain(@Param('subdomain') subdomain: string) {
    const store =
      await this.findStoreBySubdomainPublicUseCase.execute(subdomain);
    if (!store) {
      throw new NotFoundException('Boutique introuvable');
    }
    return store;
  }
}
