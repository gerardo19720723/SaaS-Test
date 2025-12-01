import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const signJWT = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
export const verifyJWT = (token) => jwt.verify(token, JWT_SECRET);
