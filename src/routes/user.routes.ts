import { Router } from 'express';
import { createUser, updatePassword } from '../controllers/user.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', asyncHandler(createUser));
router.put('/update-password', authenticateToken, asyncHandler(updatePassword));

export default router;