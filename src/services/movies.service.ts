import { Database } from '../database';

export class MoviesService {
    async getMovies(): Promise<any> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const movies = await queryRunner.manager.query(
                'CALL get_movies()'
            );

            await queryRunner.commitTransaction();

            return movies;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createMovie(movieTitle: string, director: string, releaseDate: Date, year: string, duration: string, ratingValue: number, categoryIds: number[]): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ratingSuffix = 10;

            await queryRunner.manager.query(
                'CALL create_movie(?, ?, ?, ?, ?, ?, ?, ?)',
                [movieTitle, director, releaseDate, year, duration, ratingValue, ratingSuffix, JSON.stringify(categoryIds)]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async addCategoriesToMovie(movieId: number, categoryIds: number[]): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                'CALL add_categories_to_movie(?, ?)',
                [movieId, JSON.stringify(categoryIds)]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateMovie(movieId: number, updateData: Partial<Record<string, any>>): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const setClause = Object.keys(updateData)
                .map(key => `${key} = ?`)
                .join(', ');

            const values = [...Object.values(updateData), movieId];

            const query = `UPDATE movies SET ${setClause} WHERE id = ?`;

            await queryRunner.manager.query(query, values);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteMovie(movieId: number): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                'CALL delete_movie(?)',
                [movieId]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}