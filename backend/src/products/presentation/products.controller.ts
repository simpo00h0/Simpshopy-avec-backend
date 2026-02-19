import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { ProductsService } from '../products.service';
import { FindFirstStoreByOwnerUseCase } from '../../stores/application/find-first-store-by-owner.usecase';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un produit' })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateProductDto,
  ) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    return this.productsService.create(store.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des produits de la boutique' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Request() req: { user: { id: string } },
    @Query('status') status?: string,
  ) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    return this.productsService.findByStore(store.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'un produit" })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    return this.productsService.findOne(id, store.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un produit' })
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    return this.productsService.update(id, store.id, dto);
  }
}
