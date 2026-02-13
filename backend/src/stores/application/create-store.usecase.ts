import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IStoreRepository, CreateStoreData } from '../domain/store.repository';
import { Store } from '../domain/store.entity';
import { StorePolicy } from '../domain/store.policy';

export interface CreateStoreInput
  extends Omit<CreateStoreData, 'slug' | 'ownerId'> {
  slug?: string;
}

@Injectable()
export class CreateStoreUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(ownerId: string, input: CreateStoreInput): Promise<Store> {
    const slug = input.slug || StorePolicy.slugify(input.name);

    const existing = await this.storeRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException(
        `Le slug "${slug}" est déjà pris. Choisissez un autre ou laissez-le vide pour le générer.`,
      );
    }

    return this.storeRepository.create({
      ...input,
      slug,
      ownerId,
      city: input.city || 'Dakar',
      country: input.country || 'SN',
    });
  }
}
