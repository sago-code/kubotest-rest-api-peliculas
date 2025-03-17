import { Request, Response } from 'express';
import { MoviesViewsService } from '../services/moviesViews.service';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

const moviesViewsService = new MoviesViewsService();

export const createMovieView = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { movieId } = req.body;
    const userId = req.userId;
    const token = req.headers.authorization?.split(' ')[1];


    if (!movieId) {
        return res.status(400).json({ message: 'El Id de la pelicula es requerido' });
    }

    if (movieId == 0) {
        return res.status(400).json({ message: 'Id de pelicula invalido' });
    }  
    
    if (!token) {
        return res.status(400).json({ message: 'Token de Usuario es requerido' });
    }

    try {
        await moviesViewsService.createMovieView(movieId, userId!);
        return res.status(201).json({ message: 'Pelicula marcada como vista por el usuario' + userId });
    } catch (error) {
        return res.status(500).json({ message: 'Error al marcar la pelicula como vista', error });
    }
};

export const getMoviesViews = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const moviesViews = await moviesViewsService.getMoviesViews();
        return res.status(200).json(moviesViews);
    } catch (error) {
        return res.status(500).json({ message: 'Error mostrando las peliculas vistas por los usuarios', error });
    }
}

export const getMoviesViewsByUser = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = parseInt(req.query.userId as string);

    if (!userId) {
        return res.status(400).json({ message: 'ID de Usuario requerido' });
    }

    if (userId == 0) {
        return res.status(400).json({ message: 'ID de Usuario invalido' });
    }

    try {
        const moviesViews = await moviesViewsService.getMoviesViewsByUser(userId!);
        return res.status(200).json(moviesViews);
    } catch (error) {
        return res.status(500).json({ message: 'Error mostrando las peliculas vistas por el usuario', error });
    }
}
