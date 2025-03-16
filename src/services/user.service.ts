import { Database } from '../database';
import bcrypt from 'bcryptjs';

export class UserService {
    async createUser(name: string, email: string, password: string): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            await queryRunner.manager.query(
                'CALL create_user(?, ?, ?)',
                [name, email, hashedPassword]
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const queryRunner = Database.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await queryRunner.manager.query(
                'CALL update_password(?, ?)',
                [hashedPassword, userId]
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