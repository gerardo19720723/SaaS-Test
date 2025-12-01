import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthUser {
  id: string;
  role: 'owner' | 'admin_bar' | 'staff' | 'customer';
  businessId?: string;
  ownerId?: string;
}

export const signJWT = (payload: AuthUser): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

export const verifyJWT = (token: string): AuthUser =>
  jwt.verify(token, JWT_SECRET) as AuthUser;