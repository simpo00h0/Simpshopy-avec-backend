import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { CommissionsService } from '../commissions.service';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';

@ApiTags('commissions')
@Controller('commissions')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculer la commission pour un montant' })
  @ApiResponse({ status: 200, description: 'Commission calculée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async calculate(@Body() dto: CalculateCommissionDto) {
    return this.commissionsService.calculateCommission({
      storeId: dto.storeId,
      amount: dto.amount,
      appliesTo: dto.appliesTo,
    });
  }
}
