import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { WalletService } from '../../wallet/wallet.service';
import { EventsService } from '../../events/events.service';
import { IOrderRepository } from '../domain/order.repository';

@Injectable()
export class ConfirmPaymentUseCase {
  constructor(
    @Inject('IOrderRepository')
    private orderRepository: IOrderRepository,
    private walletService: WalletService,
    private eventsService: EventsService,
  ) {}

  async execute(orderId: string, paymentId: string): Promise<void> {
    const order =
      await this.orderRepository.findByIdForPayment(orderId);

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    if (order.paymentStatus === 'COMPLETED') {
      return;
    }

    await this.orderRepository.updatePaymentStatus(orderId, paymentId);

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
}
