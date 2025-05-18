/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 */
// @ts-nocheck
import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.get('/profile', authenticateJWT, authorizeRoles('user', 'admin'), (req: any, res: any) => {
  res.json({ message: 'User profile', user: req.user });
});

export default router; 