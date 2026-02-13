import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './presentation/cart.controller';
import { CartRepository } from './infrastructure/cart.repository';
import { ICartRepository } from './domain/cart.repository';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
