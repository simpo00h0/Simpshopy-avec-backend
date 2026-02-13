import { Injectable, Inject } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { StoreCustomer } from '../domain/store.entity';

@Injectable()
export class GetStoreCustomersUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(ownerId: string): Promise<StoreCustomer[]> {
    return this.storeRepository.getCustomers(ownerId);
  }
}
