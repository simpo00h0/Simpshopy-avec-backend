import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SupabaseAuthUser {
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified?: boolean;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Trouve ou crée l'utilisateur dans notre table users à partir des données Supabase.
   */
  async findOrCreateFromSupabase(data: SupabaseAuthUser) {
    let user = await this.prisma.user.findUnique({
      where: { authUserId: data.authUserId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    if (!user) {
      // Vérifier si un utilisateur existe déjà avec cet email (migration depuis l'ancien système)
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingByEmail) {
        // Lier le compte existant à Supabase
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            authUserId: data.authUserId,
            emailVerified: data.emailVerified ?? existingByEmail.emailVerified,
          },
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
          },
        });
      } else {
        // Nouvel utilisateur
        user = await this.prisma.user.create({
          data: {
            authUserId: data.authUserId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            emailVerified: data.emailVerified ?? false,
            role: 'SELLER',
          },
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
          },
        });
      }
    } else {
      // Mettre à jour lastLoginAt
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    return user;
  }
}
