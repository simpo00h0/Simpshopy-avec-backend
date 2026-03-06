import { Injectable, Inject } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';

@Injectable()
export class FindActiveSubdomainsUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(): Promise<string[]> {
    return this.storeRepository.findActiveSubdomains();
  }
}
