import { Database } from '../database';

export class CategoriesService {
    async getCategories(): Promise<any> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const categories = await queryRunner.manager.query(
                'SELECT * FROM categories'
            );

            await queryRunner.commitTransaction();

            return categories;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createCategory(categoryName: string): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                'CALL create_category(?)',
                [categoryName]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateCategory(categoryId: number, categoryName: string): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                'CALL update_category(?, ?)',
                [categoryName, categoryId]
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