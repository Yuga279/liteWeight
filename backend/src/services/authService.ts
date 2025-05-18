import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../config';

const jwtSecret = JWT_SECRET;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generateRefreshToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
}

export async function registerUser(email: string, password: string, role: string = 'user') {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already in use');
  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed, role });
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  return user;
} 