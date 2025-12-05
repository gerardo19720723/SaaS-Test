import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'staff' | 'customer';
  ownerId?: string;
  businessId?: string;

}

const secret = process.env.JWT_SECRET || 'supersecret';

export function signJWT(payload: AuthUser) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyJWT(token: string): AuthUser {
  return jwt.verify(token, secret) as AuthUser;
}