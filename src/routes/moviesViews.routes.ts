import { Router } from 'express';
import { createMovieView, getMoviesViews, getMoviesViewsByUser } from '../controllers/moviesViews.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, asyncHandler(createMovieView));
router.get('/', asyncHandler(getMoviesViews));
router.get('/user', asyncHandler(getMoviesViewsByUser));

export default router;