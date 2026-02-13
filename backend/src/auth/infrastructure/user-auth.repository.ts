import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserAuthRepository, UserAuthResult } from '../domain/user-auth.repository';

const USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  emailVerified: true,
  phoneVerified: true,
};

@Injectable()
export class UserAuthRepository implements IUserAuthRepository {
  constructor(private prisma: PrismaService) {}

  async findByAuthUserId(authUserId: string): Promise<UserAuthResult | null> {
    const user = await this.prisma.user.findUnique({
      where: { authUserId },
      select: USER_SELECT,
    });
    return user as UserAuthResult | null;
  }

  async findByEmail(
    email: string,
  ): Promise<{ id: string; emailVerified: boolean } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });
    return user;
  }

  async create(data: {
    authUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    emailVerified?: boolean;
  }): Promise<UserAuthResult> {
    const user = await this.prisma.user.create({
      data: {
        authUserId: data.authUserId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        emailVerified: data.emailVerified ?? false,
        role: 'SELLER',
      },
      select: USER_SELECT,
    });
    return user as UserAuthResult;
  }

  async updateAuthUser(
    id: string,
    data: { authUserId: string; emailVerified?: boolean },
  ): Promise<UserAuthResult> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        authUserId: data.authUserId,
        ...(data.emailVerified != null && { emailVerified: data.emailVerified }),
      },
      select: USER_SELECT,
    });
    return user as UserAuthResult;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
