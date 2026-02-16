import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IStoreRepository, CreateStoreData } from '../domain/store.repository';
import { Store } from '../domain/store.entity';
import { StorePolicy } from '../domain/store.policy';

export interface CreateStoreInput
  extends Omit<CreateStoreData, 'subdomain' | 'ownerId'> {
  subdomain?: string;
}

@Injectable()
export class CreateStoreUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(ownerId: string, input: CreateStoreInput): Promise<Store> {
    const subdomain = input.subdomain || StorePolicy.subdomainFromName(input.name);

    const existing = await this.storeRepository.findBySubdomain(subdomain);
    if (existing) {
      throw new ConflictException(
        `Le sous-domaine "${subdomain}" est déjà pris. Choisissez un autre nom de boutique.`,
      );
    }

    return this.storeRepository.create({
      ...input,
      subdomain,
      ownerId,
      city: input.city || 'Dakar',
      country: input.country || 'SN',
    });
  }
}
