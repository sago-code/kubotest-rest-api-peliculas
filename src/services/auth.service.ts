import { Database } from '../database/database';
import { Users } from '../entities/user.entity';
import { Token } from '../entities/token.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IsNull } from 'typeorm';

export class AuthService {
    async login(email: string, password: string): Promise<string> {
        const userRepository = Database.getRepository(Users);
        const tokenRepository = Database.getRepository(Token);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            throw new Error('Correo o contraseña invalidos');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Correo o contraseña invalidos');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        const tokenEntity = tokenRepository.create({ token, user });
        await tokenRepository.save(tokenEntity);

        return token;
    }

    async logout(userId: number, token: string): Promise<void> {
        const tokenRepository = Database.getRepository(Token);
        const tokenEntity = await tokenRepository.findOne({ where: { token, user: { id: userId }, deletedAt: IsNull() } });

        if (!tokenEntity) {
            throw new Error('Token invalido');
        }

        tokenEntity.deletedAt = new Date();
        await tokenRepository.save(tokenEntity);
    }
}