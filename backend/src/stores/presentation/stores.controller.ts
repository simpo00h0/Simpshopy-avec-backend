import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { StoresService } from '../stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreSettingsDto } from './dto/update-store.dto';

@ApiTags('stores')
@Controller('stores')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une boutique' })
  async create(
    @Body() dto: CreateStoreDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.storesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes boutiques' })
  async findByOwner(@Request() req: { user: { id: string } }) {
    return this.storesService.findByOwner(req.user.id);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Liste des clients de la boutique' })
  async getCustomers(@Request() req: { user: { id: string } }) {
    return this.storesService.getCustomers(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'une boutique" })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.storesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier la boutique' })
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, req.user.id, dto);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Modifier les paramètres de la boutique' })
  async updateSettings(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateStoreSettingsDto,
  ) {
    return this.storesService.updateSettings(id, req.user.id, dto);
  }
}
