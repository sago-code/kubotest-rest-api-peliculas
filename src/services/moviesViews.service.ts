import e from 'express';
import { Database } from '../database/database';

export class MoviesViewsService {
    async createMovieView(movieId: number, userId: number): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                'CALL create_movies_views(?, ?)',
                [movieId, userId]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMoviesViews(): Promise<any> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const moviesViews = await queryRunner.manager.query(
                'SELECT * FROM movies_views'
            );

            await queryRunner.commitTransaction();

            return moviesViews;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMoviesViewsByUser(userId: number): Promise<any> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const moviesViews = await queryRunner.manager.query(
                'SELECT * FROM movies_views WHERE userId = ?',
                [userId]
            );

            await queryRunner.commitTransaction();

            return moviesViews;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
