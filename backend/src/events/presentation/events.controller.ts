import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { EventsService } from '../events.service';
import { StoresService } from '../../stores/stores.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('events')
@Controller('events')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un log d\'événement' })
  @ApiResponse({ status: 201, description: 'Événement créé avec succès' })
  async create(@Request() req, @Body() dto: CreateEventDto) {
    return this.eventsService.log({
      ...dto,
      actorId: dto.actorId || req.user.id,
      actorType: dto.actorType || 'user',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Liste des événements' })
  @ApiQuery({ name: 'storeId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Liste des événements' })
  async findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    let resolvedStoreId = storeId;

    if (req.user.role === 'SELLER' && !storeId) {
      const store = await this.storesService.findFirstByOwner(req.user.id);
      resolvedStoreId = store.id;
    }

    return this.eventsService.list({
      storeId: resolvedStoreId,
      type: type ?? undefined,
      limit: limit ? parseInt(limit.toString()) : 50,
    });
  }
}
