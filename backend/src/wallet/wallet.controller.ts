import { Controller, Get, Post, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../auth/guards/supabase-jwt.guard';
import { WalletService } from './wallet.service';
import { CreditWalletDto, DebitWalletDto } from './presentation/dto/wallet.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private prisma: PrismaService,
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Obtenir le solde du wallet' })
  @ApiResponse({ status: 200, description: 'Solde récupéré avec succès' })
  async getBalance(@Request() req) {
    const storeId = await this.getStoreIdFromUser(req.user.id);
    const balance = await this.walletService.getBalance(storeId);

    return { balance, currency: 'XOF' };
  }

  @Post('credit')
  @ApiOperation({ summary: 'Créditer le wallet' })
  @ApiResponse({ status: 201, description: 'Wallet crédité avec succès' })
  async credit(@Request() req, @Body() dto: CreditWalletDto) {
    const storeId = await this.getStoreIdFromUser(req.user.id);

    return this.walletService.credit({
      storeId,
      ...dto,
    });
  }

  @Post('debit')
  @ApiOperation({ summary: 'Débiter le wallet' })
  @ApiResponse({ status: 201, description: 'Wallet débité avec succès' })
  @ApiResponse({ status: 400, description: 'Solde insuffisant' })
  async debit(@Request() req, @Body() dto: DebitWalletDto) {
    const storeId = await this.getStoreIdFromUser(req.user.id);

    return this.walletService.debit({
      storeId,
      ...dto,
    });
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtenir l\'historique des transactions' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Transactions récupérées avec succès' })
  async getTransactions(@Request() req, @Query('limit') limit?: number) {
    const storeId = await this.getStoreIdFromUser(req.user.id);
    const wallet = await this.prisma.wallet.findUnique({
      where: { storeId },
    });

    if (!wallet) {
      return [];
    }

    return this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit.toString()) : 50,
    });
  }

  private async getStoreIdFromUser(userId: string): Promise<string> {
    const store = await this.prisma.store.findFirst({
      where: { ownerId: userId },
    });

    if (!store) {
      throw new Error('Aucune boutique trouvée pour cet utilisateur');
    }

    return store.id;
  }
}
