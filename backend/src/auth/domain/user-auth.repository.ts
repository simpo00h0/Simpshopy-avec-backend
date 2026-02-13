export interface UserAuthResult {
  id: string;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface IUserAuthRepository {
  findByAuthUserId(authUserId: string): Promise<UserAuthResult | null>;

  findByEmail(email: string): Promise<{ id: string; emailVerified: boolean } | null>;

  create(data: {
    authUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    emailVerified?: boolean;
  }): Promise<UserAuthResult>;

  updateAuthUser(
    id: string,
    data: { authUserId: string; emailVerified?: boolean },
  ): Promise<UserAuthResult>;

  updateLastLogin(id: string): Promise<void>;
}
