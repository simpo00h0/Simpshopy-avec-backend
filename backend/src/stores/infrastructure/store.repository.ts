import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IStoreRepository,
  CreateStoreData,
  UpdateStoreData,
  UpdateStoreSettingsData,
} from '../domain/store.repository';
import { Store, StorePublic, StoreCustomer } from '../domain/store.entity';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(private prisma: PrismaService) {}

  async findBySubdomain(subdomain: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { subdomain },
    });
    return store as Store | null;
  }

  async create(data: CreateStoreData): Promise<Store> {
    const store = await this.prisma.store.create({
      data: {
        name: data.name,
        subdomain: data.subdomain,
        email: data.email,
        phone: data.phone,
        city: data.city,
        country: data.country,
        address: data.address,
        description: data.description,
        ownerId: data.ownerId,
        wallet: { create: {} },
        settings: { create: {} },
      },
      include: { wallet: true, settings: true },
    });
    return store as Store;
  }

  async findByOwner(ownerId: string): Promise<Store[]> {
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      include: { wallet: true, settings: true },
      orderBy: { createdAt: 'desc' },
    });
    return stores as Store[];
  }

  async findFirstByOwner(ownerId: string): Promise<Store | null> {
    const store = await this.prisma.store.findFirst({
      where: { ownerId },
      include: { wallet: true, settings: true },
    });
    return store as Store | null;
  }

  async findBySubdomainPublic(subdomain: string): Promise<StorePublic | null> {
    const store = await this.prisma.store.findFirst({
      where: { subdomain, status: { in: ['ACTIVE', 'DRAFT'] } },
      include: {
        settings: { select: { themeId: true, themeCustomization: true } },
        products: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            compareAtPrice: true,
            images: true,
          },
        },
        categories: {
          where: { parentId: null },
          select: {
            id: true,
            slug: true,
            name: true,
            products: { where: { status: 'ACTIVE' }, select: { id: true } },
          },
        },
      },
    });
    if (!store) return null;

    const productIds = (store.products as { id: string }[]).map((p) => p.id);
    const collections = [
      { id: 'all', slug: 'all', name: 'Tous les produits', productIds },
      ...(store.categories as { id: string; slug: string; name: string; products: { id: string }[] }[]).map(
        (c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          productIds: c.products.map((p) => p.id),
        })
      ),
    ];

    return {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      description: store.description,
      logo: store.logo,
      banner: store.banner,
      email: store.email,
      phone: store.phone,
      themeId: store.settings?.themeId ?? 'classique',
      themeCustomization:
        (store.settings?.themeCustomization as object | null) ?? null,
      products: store.products,
      collections,
    };
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { wallet: true, settings: true },
    });
    return store as Store | null;
  }

  async update(id: string, data: UpdateStoreData): Promise<Store> {
    const store = await this.prisma.store.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.description != null && { description: data.description }),
        ...(data.email != null && { email: data.email }),
        ...(data.phone != null && { phone: data.phone }),
        ...(data.address != null && { address: data.address }),
        ...(data.city != null && { city: data.city }),
        ...(data.country != null && { country: data.country }),
      },
    });
    return store as Store;
  }

  async updateSettings(
    storeId: string,
    data: UpdateStoreSettingsData,
  ): Promise<void> {
    await this.prisma.storeSettings.update({
      where: { storeId },
      data: {
        ...(data.enableMobileMoney != null && {
          enableMobileMoney: data.enableMobileMoney,
        }),
        ...(data.enableCardPayment != null && {
          enableCardPayment: data.enableCardPayment,
        }),
        ...(data.enableBankTransfer != null && {
          enableBankTransfer: data.enableBankTransfer,
        }),
        ...(data.enableCashOnDelivery != null && {
          enableCashOnDelivery: data.enableCashOnDelivery,
        }),
        ...(data.enableShipping != null && {
          enableShipping: data.enableShipping,
        }),
        ...(data.freeShippingThreshold != null && {
          freeShippingThreshold: data.freeShippingThreshold,
        }),
        ...(data.themeId != null && { themeId: data.themeId }),
        ...(data.themeCustomization != null && {
          themeCustomization: data.themeCustomization,
        }),
      },
    });
  }

  async getCustomers(ownerId: string): Promise<StoreCustomer[]> {
    const store = await this.prisma.store.findFirst({
      where: { ownerId },
    });
    if (!store) return [];

    const orders = await this.prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    const map = new Map<
      string,
      { customer: StoreCustomer['customer']; orders: number; total: number }
    >();
    for (const o of orders) {
      const c = o.customer;
      const cur = map.get(c.id);
      if (cur) {
        cur.orders += 1;
        cur.total += o.total;
      } else {
        map.set(c.id, {
          customer: c,
          orders: 1,
          total: o.total,
        });
      }
    }
    return Array.from(map.values());
  }
}
