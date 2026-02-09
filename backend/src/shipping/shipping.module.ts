import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './presentation/shipping.controller';
import { CalculateShippingUseCase } from './application/calculate-shipping.usecase';
import { ShippingRepository } from './infrastructure/shipping.repository';
import { IShippingRepository } from './domain/shipping.repository';

@Module({
  controllers: [ShippingController],
  providers: [
    ShippingService,
    CalculateShippingUseCase,
    {
      provide: 'IShippingRepository',
      useClass: ShippingRepository,
    },
  ],
  exports: [ShippingService],
})
export class ShippingModule {}
