import { Router } from 'express';
import { getMovies, createMovie, updateMovie, addCategoriesToMovie } from '../controllers/movies.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getMovies));
router.post('/', asyncHandler(createMovie));
router.put('/', asyncHandler(updateMovie));
router.post('/categories', asyncHandler(addCategoriesToMovie));

export default router;