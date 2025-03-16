import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categories.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { updateCategory } from '../controllers/categories.controller';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.post('/', asyncHandler(createCategory));
router.put('/', asyncHandler(updateCategory));

export default router;

