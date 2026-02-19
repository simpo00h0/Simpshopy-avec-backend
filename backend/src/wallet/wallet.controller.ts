import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../auth/guards/supabase-jwt.guard';
import { WalletService } from './wallet.service';
import { FindFirstStoreByOwnerUseCase } from '../stores/application/find-first-store-by-owner.usecase';
import { CreditWalletDto, DebitWalletDto } from './presentation/dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Obtenir le solde du wallet' })
  @ApiResponse({ status: 200, description: 'Solde récupéré avec succès' })
  async getBalance(@Request() req) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    const balance = await this.walletService.getBalance(store.id);

    return { balance, currency: 'XOF' };
  }

  @Post('credit')
  @ApiOperation({ summary: 'Créditer le wallet' })
  @ApiResponse({ status: 201, description: 'Wallet crédité avec succès' })
  async credit(@Request() req, @Body() dto: CreditWalletDto) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);

    return this.walletService.credit({
      storeId: store.id,
      ...dto,
    });
  }

  @Post('debit')
  @ApiOperation({ summary: 'Débiter le wallet' })
  @ApiResponse({ status: 201, description: 'Wallet débité avec succès' })
  @ApiResponse({ status: 400, description: 'Solde insuffisant' })
  async debit(@Request() req, @Body() dto: DebitWalletDto) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);

    return this.walletService.debit({
      storeId: store.id,
      ...dto,
    });
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtenir l\'historique des transactions' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Transactions récupérées avec succès' })
  async getTransactions(@Request() req, @Query('limit') limit?: number) {
    const store =
      await this.findFirstStoreByOwnerUseCase.execute(req.user.id);

    return this.walletService.getTransactions(
      store.id,
      limit ? parseInt(limit.toString()) : 50,
    );
  }
}
