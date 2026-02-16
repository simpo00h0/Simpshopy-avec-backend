import { Injectable } from '@nestjs/common';
import { CreateStoreUseCase } from './application/create-store.usecase';
import { FindStoresByOwnerUseCase } from './application/find-stores-by-owner.usecase';
import { FindFirstStoreByOwnerUseCase } from './application/find-first-store-by-owner.usecase';
import { FindStoreBySubdomainPublicUseCase } from './application/find-store-by-subdomain-public.usecase';
import { FindStoreUseCase } from './application/find-store.usecase';
import { UpdateStoreUseCase } from './application/update-store.usecase';
import { UpdateStoreSettingsUseCase } from './application/update-store-settings.usecase';
import { GetStoreCustomersUseCase } from './application/get-store-customers.usecase';
import { CreateStoreInput } from './application/create-store.usecase';
import {
  UpdateStoreData,
  UpdateStoreSettingsData,
} from './domain/store.repository';

@Injectable()
export class StoresService {
  constructor(
    private createStoreUseCase: CreateStoreUseCase,
    private findStoresByOwnerUseCase: FindStoresByOwnerUseCase,
    private findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
    private findStoreBySubdomainPublicUseCase: FindStoreBySubdomainPublicUseCase,
    private findStoreUseCase: FindStoreUseCase,
    private updateStoreUseCase: UpdateStoreUseCase,
    private updateStoreSettingsUseCase: UpdateStoreSettingsUseCase,
    private getStoreCustomersUseCase: GetStoreCustomersUseCase,
  ) {}

  async create(ownerId: string, dto: CreateStoreInput) {
    return this.createStoreUseCase.execute(ownerId, dto);
  }

  async findByOwner(ownerId: string) {
    return this.findStoresByOwnerUseCase.execute(ownerId);
  }

  async findFirstByOwner(ownerId: string) {
    return this.findFirstStoreByOwnerUseCase.execute(ownerId);
  }

  async findBySubdomainPublic(subdomain: string) {
    return this.findStoreBySubdomainPublicUseCase.execute(subdomain);
  }

  async findOne(id: string, ownerId: string) {
    return this.findStoreUseCase.execute(id, ownerId);
  }

  async update(id: string, ownerId: string, dto: UpdateStoreData) {
    return this.updateStoreUseCase.execute(id, ownerId, dto);
  }

  async updateSettings(
    id: string,
    ownerId: string,
    dto: UpdateStoreSettingsData,
  ) {
    return this.updateStoreSettingsUseCase.execute(id, ownerId, dto);
  }

  async getCustomers(ownerId: string) {
    return this.getStoreCustomersUseCase.execute(ownerId);
  }
}
