export interface User {
  id: string;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  avatar?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  authUserId?: string | null;
  createdAt?: Date;
  lastLoginAt?: Date | null;
}
