import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../auth/guards/supabase-jwt.guard';
import { PagesService } from './pages.service';
import { FindFirstStoreByOwnerUseCase } from '../stores/application/find-first-store-by-owner.usecase';
import { CreatePageDto, UpdatePageDto } from './presentation/dto/page.dto';

@ApiTags('pages')
@Controller('pages')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle page' })
  @ApiResponse({ status: 201, description: 'Page créée avec succès' })
  async create(@Request() req, @Body() dto: CreatePageDto) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);

    return this.pagesService.createPage({
      ...dto,
      storeId: store.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Liste des pages' })
  @ApiQuery({ name: 'storeId', required: false, type: String })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Liste des pages' })
  async findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('published') published?: string,
  ) {
    let resolvedStoreId = storeId;

    if (req.user.role === 'SELLER' && !storeId) {
      const store =
        await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
      resolvedStoreId = store.id;
    }

    const filters = {
      ...(resolvedStoreId && { storeId: resolvedStoreId }),
      ...(published === 'true' && { isPublished: true }),
    };

    return this.pagesService.listPages(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une page' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Détails de la page' })
  @ApiResponse({ status: 404, description: 'Page non trouvée' })
  async findOne(@Request() req, @Param('id') id: string) {
    const page = await this.pagesService.getPage(id);

    if (req.user.role === 'SELLER') {
      const store =
        await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
      if (page.storeId !== store.id) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }

    return page;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une page' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'createVersion', required: false, type: Boolean, example: true })
  @ApiQuery({ name: 'note', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Page mise à jour avec succès' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdatePageDto,
    @Query('createVersion') createVersion?: string,
    @Query('note') note?: string,
  ) {
    const page = await this.pagesService.getPage(id);

    if (req.user.role === 'SELLER') {
      const store =
        await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
      if (page.storeId !== store.id) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }

    const shouldCreateVersion = createVersion !== 'false';

    return this.pagesService.updatePage(
      { id, ...dto },
      shouldCreateVersion,
      note,
    );
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Liste des versions d\'une page' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Versions de la page' })
  async getVersions(@Request() req, @Param('id') id: string) {
    const page = await this.pagesService.getPage(id);

    if (req.user.role === 'SELLER') {
      const store =
        await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
      if (page.storeId !== store.id) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }

    return this.pagesService.getPageVersions(id);
  }

  @Post(':id/restore/:version')
  @ApiOperation({ summary: 'Restaurer une version précédente' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'version', type: Number })
  @ApiResponse({ status: 200, description: 'Version restaurée avec succès' })
  async restoreVersion(
    @Request() req,
    @Param('id') id: string,
    @Param('version') version: string,
  ) {
    const page = await this.pagesService.getPage(id);

    if (req.user.role === 'SELLER') {
      const store =
        await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
      if (page.storeId !== store.id) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }

    return this.pagesService.restoreVersion(id, parseInt(version));
  }
}
