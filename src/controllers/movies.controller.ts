import { Request, Response } from 'express';
import { MoviesService } from '../services/movies.service';

const moviesService = new MoviesService();

export const getMovies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movies = await moviesService.getMovies();
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving movies', error });
    }
};

export const createMovie = async (req: Request, res: Response): Promise<Response> => {
    const { movieTitle, director, releaseDate, year, duration, ratingValue, categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ message: 'categoryIds must be a non-empty array' });
    }

    try {
        await moviesService.createMovie(movieTitle, director, releaseDate, year, duration, ratingValue, categoryIds);
        return res.status(201).json({ message: 'Pelicula creada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la pelicula', error });
    }
};

export const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    const movieId = parseInt(req.query.id as string);
    const updateData = req.body;

    try {
        await moviesService.updateMovie(movieId, updateData);
        return res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating movie', error });
    }
};

export const addCategoriesToMovie = async (req: Request, res: Response): Promise<Response> => {
    const movieId = parseInt(req.query.movieId as string);
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ message: 'categoryIds no puede estar vacia' });
    }

    try {
        await moviesService.addCategoriesToMovie(movieId, categoryIds);
        return res.status(200).json({ message: 'Categorias añadidas correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'error añadiendo categorias', error });
    }
};