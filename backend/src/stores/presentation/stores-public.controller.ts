import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FindStoreBySubdomainPublicUseCase } from '../application/find-store-by-subdomain-public.usecase';
import { FindActiveSubdomainsUseCase } from '../application/find-active-subdomains.usecase';

@ApiTags('storefront')
@Controller('storefront')
export class StoresPublicController {
  private readonly logger = new Logger(StoresPublicController.name);

  constructor(
    private readonly findStoreBySubdomainPublicUseCase: FindStoreBySubdomainPublicUseCase,
    private readonly findActiveSubdomainsUseCase: FindActiveSubdomainsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste des sous-domaines des boutiques actives (pour sitemap)' })
  async findAllSubdomains(): Promise<{ subdomains: string[] }> {
    const subdomains = await this.findActiveSubdomainsUseCase.execute();
    return { subdomains };
  }

  @Get(':subdomain')
  @ApiOperation({
    summary: "Données publiques d'une boutique (par sous-domaine)",
  })
  async findBySubdomain(@Param('subdomain') subdomain: string) {
    try {
      const store =
        await this.findStoreBySubdomainPublicUseCase.execute(subdomain);
      if (!store) {
        throw new NotFoundException('Boutique introuvable');
      }
      return store;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(
        `Erreur storefront/${subdomain}: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'production'
          ? 'Erreur lors du chargement de la boutique'
          : err instanceof Error
            ? err.message
            : 'Erreur inconnue',
      );
    }
  }
}
