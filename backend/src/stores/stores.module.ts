import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoresService } from './stores.service';
import { StoresController } from './presentation/stores.controller';
import { StoresPublicController } from './presentation/stores-public.controller';
import { CreateStoreUseCase } from './application/create-store.usecase';
import { FindStoresByOwnerUseCase } from './application/find-stores-by-owner.usecase';
import { FindFirstStoreByOwnerUseCase } from './application/find-first-store-by-owner.usecase';
import { FindStoreBySlugPublicUseCase } from './application/find-store-by-slug-public.usecase';
import { FindStoreUseCase } from './application/find-store.usecase';
import { UpdateStoreUseCase } from './application/update-store.usecase';
import { UpdateStoreSettingsUseCase } from './application/update-store-settings.usecase';
import { GetStoreCustomersUseCase } from './application/get-store-customers.usecase';
import { StoreRepository } from './infrastructure/store.repository';
import { IStoreRepository } from './domain/store.repository';

@Module({
  imports: [AuthModule],
  controllers: [StoresController, StoresPublicController],
  providers: [
    StoresService,
    CreateStoreUseCase,
    FindStoresByOwnerUseCase,
    FindFirstStoreByOwnerUseCase,
    FindStoreBySlugPublicUseCase,
    FindStoreUseCase,
    UpdateStoreUseCase,
    UpdateStoreSettingsUseCase,
    GetStoreCustomersUseCase,
    StoreRepository,
    {
      provide: 'IStoreRepository',
      useClass: StoreRepository,
    },
  ],
  exports: [StoresService],
})
export class StoresModule {}
