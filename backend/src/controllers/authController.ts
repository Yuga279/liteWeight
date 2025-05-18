import { Request, Response } from 'express';
import User from '../models/User';
import {
  registerUser,
  authenticateUser,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from '../services/authService';
import crypto from 'crypto';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  // Stateless JWT: logout is handled on the client by deleting the token
  res.json({ message: 'Logged out' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    // Mock email sending
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}&email=${email}`);
    res.json({ message: 'Password reset link sent (mocked)' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ where: { email, passwordResetToken: token } });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = await hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}; 