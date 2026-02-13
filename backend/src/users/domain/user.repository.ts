import { User } from './user.entity';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  findByAuthUserId(authUserId: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(data: {
    authUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    emailVerified?: boolean;
  }): Promise<User>;

  updateAuthUser(
    id: string,
    data: { authUserId: string; emailVerified?: boolean },
  ): Promise<User>;

  updateLastLogin(id: string): Promise<void>;

  update(id: string, data: UpdateUserData): Promise<User>;
}
