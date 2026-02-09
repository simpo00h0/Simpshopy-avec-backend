import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommissionsService } from './commissions.service';
import { CommissionsController } from './presentation/commissions.controller';
import { CalculateCommissionUseCase } from './application/calculate-commission.usecase';
import { CommissionRepository } from './infrastructure/commission.repository';
import { ICommissionRepository } from './domain/commission.repository';

@Module({
  imports: [AuthModule],
  controllers: [CommissionsController],
  providers: [
    CommissionsService,
    CalculateCommissionUseCase,
    {
      provide: 'ICommissionRepository',
      useClass: CommissionRepository,
    },
  ],
  exports: [CommissionsService],
})
export class CommissionsModule {}
