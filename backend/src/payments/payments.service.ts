import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implémenter les intégrations Mobile Money (Orange, MTN, Moov)
  // TODO: Implémenter les paiements par carte
  // TODO: Implémenter les virements bancaires
}
