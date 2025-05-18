/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
// @ts-nocheck
import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.get('/dashboard', authenticateJWT, authorizeRoles('admin'), (req: any, res: any) => {
  res.json({ message: 'Admin dashboard', user: req.user });
});

router.get('/users', authenticateJWT, authorizeRoles('admin'), async (_req, res) => {
  const users = await require('../models/User').default.findAll({ attributes: ['id', 'email', 'role'] });
  res.json(users);
});

export default router; 