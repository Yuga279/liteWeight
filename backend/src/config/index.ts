import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; 