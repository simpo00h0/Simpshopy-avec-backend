import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { Store } from '../domain/store.entity';

@Injectable()
export class FindFirstStoreByOwnerUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(ownerId: string): Promise<Store> {
    const store = await this.storeRepository.findFirstByOwner(ownerId);
    if (!store) {
      throw new NotFoundException('Aucune boutique trouvée pour cet utilisateur');
    }
    return store;
  }
}
