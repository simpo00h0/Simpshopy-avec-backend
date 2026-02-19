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
import { CreateStoreUseCase } from '../application/create-store.usecase';
import { FindStoresByOwnerUseCase } from '../application/find-stores-by-owner.usecase';
import { FindFirstStoreByOwnerUseCase } from '../application/find-first-store-by-owner.usecase';
import { FindStoreUseCase } from '../application/find-store.usecase';
import { UpdateStoreUseCase } from '../application/update-store.usecase';
import { UpdateStoreSettingsUseCase } from '../application/update-store-settings.usecase';
import { GetStoreCustomersUseCase } from '../application/get-store-customers.usecase';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreSettingsDto } from './dto/update-store.dto';

@ApiTags('stores')
@Controller('stores')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly findStoresByOwnerUseCase: FindStoresByOwnerUseCase,
    private readonly findStoreUseCase: FindStoreUseCase,
    private readonly updateStoreUseCase: UpdateStoreUseCase,
    private readonly updateStoreSettingsUseCase: UpdateStoreSettingsUseCase,
    private readonly getStoreCustomersUseCase: GetStoreCustomersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une boutique' })
  async create(
    @Body() dto: CreateStoreDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.createStoreUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes boutiques' })
  async findByOwner(@Request() req: { user: { id: string } }) {
    return this.findStoresByOwnerUseCase.execute(req.user.id);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Liste des clients de la boutique' })
  async getCustomers(@Request() req: { user: { id: string } }) {
    return this.getStoreCustomersUseCase.execute(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'une boutique" })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.findStoreUseCase.execute(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier la boutique' })
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.updateStoreUseCase.execute(id, req.user.id, dto);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Modifier les paramètres de la boutique' })
  async updateSettings(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateStoreSettingsDto,
  ) {
    return this.updateStoreSettingsUseCase.execute(id, req.user.id, dto);
  }
}
