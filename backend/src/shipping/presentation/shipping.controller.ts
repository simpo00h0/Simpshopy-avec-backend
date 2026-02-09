import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShippingService } from '../shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculer les options de livraison' })
  @ApiResponse({ status: 200, description: 'Options de livraison calculées' })
  async calculate(@Body() dto: CalculateShippingDto) {
    return this.shippingService.calculateShipping({
      storeId: dto.storeId,
      country: dto.country,
      city: dto.city,
      weight: dto.weight,
    });
  }
}
