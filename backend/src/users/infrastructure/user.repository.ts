import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IUserRepository,
  UpdateUserData,
} from '../domain/user.repository';
import { User } from '../domain/user.entity';

const USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  avatar: true,
  emailVerified: true,
  phoneVerified: true,
  authUserId: true,
  createdAt: true,
  lastLoginAt: true,
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    return user as User | null;
  }

  async findByAuthUserId(authUserId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { authUserId },
      select: USER_SELECT,
    });
    return user as User | null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as User | null;
  }

  async create(data: {
    authUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    emailVerified?: boolean;
  }): Promise<User> {
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
    return user as User;
  }

  async updateAuthUser(
    id: string,
    data: { authUserId: string; emailVerified?: boolean },
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        authUserId: data.authUserId,
        ...(data.emailVerified != null && { emailVerified: data.emailVerified }),
      },
      select: USER_SELECT,
    });
    return user as User;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
    return user as User;
  }
}
