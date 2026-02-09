import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreSettingsDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(ownerId: string, dto: CreateStoreDto) {
    const slug = dto.slug || this.slugify(dto.name);

    const existing = await this.prisma.store.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(
        `Le slug "${slug}" est déjà pris. Choisissez un autre ou laissez-le vide pour le générer.`,
      );
    }

    const store = await this.prisma.store.create({
      data: {
        name: dto.name,
        slug,
        email: dto.email,
        phone: dto.phone,
        city: dto.city || 'Dakar',
        country: dto.country || 'SN',
        address: dto.address,
        description: dto.description,
        ownerId,
        wallet: { create: {} },
        settings: { create: {} },
      },
      include: {
        wallet: true,
        settings: true,
      },
    });

    return store;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.store.findMany({
      where: { ownerId },
      include: { wallet: true, settings: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlugPublic(slug: string) {
    const store = await this.prisma.store.findFirst({
      where: { slug, status: { in: ['ACTIVE', 'DRAFT'] } },
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
      },
    });
    if (!store) return null;
    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      banner: store.banner,
      email: store.email,
      phone: store.phone,
      themeId: store.settings?.themeId ?? 'classique',
      themeCustomization: (store.settings?.themeCustomization as object | null) ?? null,
      products: store.products,
    };
  }

  async findOne(id: string, ownerId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { wallet: true, settings: true },
    });
    if (!store) return null;
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette boutique');
    }
    return store;
  }

  async update(id: string, ownerId: string, dto: UpdateStoreDto) {
    await this.findOne(id, ownerId);
    return this.prisma.store.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.description != null && { description: dto.description }),
        ...(dto.email != null && { email: dto.email }),
        ...(dto.phone != null && { phone: dto.phone }),
        ...(dto.address != null && { address: dto.address }),
        ...(dto.city != null && { city: dto.city }),
        ...(dto.country != null && { country: dto.country }),
      },
    });
  }

  private deepMerge(target: Record<string, unknown> | null, source: Record<string, unknown>): Record<string, unknown> {
    if (!target || typeof target !== 'object') return { ...source };
    const result = { ...target };
    for (const key of Object.keys(source)) {
      const val = source[key];
      const tgt = target[key];
      if (val != null && typeof val === 'object' && !Array.isArray(val) && tgt != null && typeof tgt === 'object' && !Array.isArray(tgt)) {
        result[key] = this.deepMerge(tgt as Record<string, unknown>, val as Record<string, unknown>);
      } else if (val !== undefined) {
        result[key] = val;
      }
    }
    return result;
  }

  async updateSettings(id: string, ownerId: string, dto: UpdateStoreSettingsDto) {
    const store = await this.findOne(id, ownerId);
    if (!store.settings) return store;

    let themeCustomizationData: object | undefined;
    if (dto.themeCustomization != null) {
      const existing = (store.settings as { themeCustomization?: object }).themeCustomization as Record<string, unknown> | null;
      themeCustomizationData = this.deepMerge(existing ?? {}, dto.themeCustomization as Record<string, unknown>);
    }

    await this.prisma.storeSettings.update({
      where: { storeId: id },
      data: {
        ...(dto.enableMobileMoney != null && { enableMobileMoney: dto.enableMobileMoney }),
        ...(dto.enableCardPayment != null && { enableCardPayment: dto.enableCardPayment }),
        ...(dto.enableBankTransfer != null && { enableBankTransfer: dto.enableBankTransfer }),
        ...(dto.enableCashOnDelivery != null && { enableCashOnDelivery: dto.enableCashOnDelivery }),
        ...(dto.enableShipping != null && { enableShipping: dto.enableShipping }),
        ...(dto.freeShippingThreshold != null && { freeShippingThreshold: dto.freeShippingThreshold }),
        ...(dto.themeId != null && { themeId: dto.themeId }),
        ...(themeCustomizationData != null && { themeCustomization: themeCustomizationData }),
      },
    });
    return this.findOne(id, ownerId);
  }

  async getCustomers(ownerId: string) {
    const store = await this.prisma.store.findFirst({ where: { ownerId } });
    if (!store) return [];
    const orders = await this.prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    const map = new Map<string, { customer: typeof orders[0]['customer']; orders: number; total: number }>();
    for (const o of orders) {
      const c = o.customer;
      const cur = map.get(c.id);
      if (cur) {
        cur.orders += 1;
        cur.total += o.total;
      } else {
        map.set(c.id, { customer: c, orders: 1, total: o.total });
      }
    }
    return Array.from(map.values());
  }
}
