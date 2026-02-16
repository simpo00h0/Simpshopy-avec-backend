import { Injectable, Inject } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { StorePublic } from '../domain/store.entity';

@Injectable()
export class FindStoreBySubdomainPublicUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(subdomain: string): Promise<StorePublic | null> {
    return this.storeRepository.findBySubdomainPublic(subdomain);
  }
}
