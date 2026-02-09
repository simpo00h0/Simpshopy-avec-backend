import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { EventsService } from '../events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('events')
@Controller('events')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private prisma: PrismaService,
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
    const where: any = {};

    if (req.user.role === 'SELLER' && !storeId) {
      const store = await this.getStoreFromUser(req.user.id);
      where.storeId = store.id;
    } else if (storeId) {
      where.storeId = storeId;
    }

    if (type) {
      where.type = type;
    }

    return this.prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit.toString()) : 50,
    });
  }

  private async getStoreFromUser(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: { ownerId: userId },
    });

    if (!store) {
      throw new Error('Aucune boutique trouvée pour cet utilisateur');
    }

    return store;
  }
}
