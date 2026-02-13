import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { OrdersService } from './orders.service';
import { StoresService } from '../stores/stores.service';
import { CreateOrderDto } from './presentation/dto/create-order.dto';
import { ConfirmPaymentDto } from './presentation/dto/confirm-payment.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle commande' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder({
      ...dto,
      customerId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Liste des commandes' })
  @ApiQuery({ name: 'storeId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  async findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('status') status?: string,
  ) {
    const filters: Record<string, string> = {};
    if (status) filters.status = status;

    if (req.user.role === 'SELLER') {
      const store = await this.storesService.findFirstByOwner(req.user.id);
      filters.storeId = store.id;
    } else if (storeId) {
      filters.storeId = storeId;
    }

    if (req.user.role === 'CUSTOMER') {
      filters.customerId = req.user.id;
    }

    return this.ordersService.listOrders(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une commande' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Détails de la commande' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  async findOne(@Request() req, @Param('id') id: string) {
    const order = await this.ordersService.getOrder(id);

    if (req.user.role === 'CUSTOMER' && order.customerId !== req.user.id) {
      throw new ForbiddenException('Accès non autorisé');
    }

    if (req.user.role === 'SELLER') {
      const store = await this.storesService.findFirstByOwner(req.user.id);
      if (order.storeId !== store.id) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }

    return order;
  }

  @Post(':id/confirm-payment')
  @ApiOperation({ summary: 'Confirmer le paiement d\'une commande' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Paiement confirmé avec succès' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  async confirmPayment(
    @Param('id') id: string,
    @Body() dto: ConfirmPaymentDto,
  ) {
    await this.ordersService.confirmPayment(id, dto.paymentId);
    return { message: 'Paiement confirmé avec succès' };
  }
}
