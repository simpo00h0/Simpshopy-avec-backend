import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../../wallet/wallet.service';
import { EventsService } from '../../events/events.service';

@Injectable()
export class ConfirmPaymentUseCase {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private eventsService: EventsService,
  ) {}

  async execute(orderId: string, paymentId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Commande introuvable');
    }

    if (order.paymentStatus === 'COMPLETED') {
      return;
    }

    await this.updateOrderPayment(orderId, paymentId);

    const sellerAmount = order.total - order.platformFeeAmount;

    await this.walletService.credit({
      storeId: order.storeId,
      amount: sellerAmount,
      type: 'credit',
      orderId: order.id,
      description: `Paiement commande ${order.orderNumber}`,
    });

    await this.eventsService.logPaymentCompleted(
      order.id,
      order.storeId,
      paymentId,
    );
  }

  private async updateOrderPayment(orderId: string, paymentId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
        paymentId,
        status: 'CONFIRMED',
      },
    });
  }
}
