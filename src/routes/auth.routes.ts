import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/logout', authenticateToken, asyncHandler(logout));

export default router;