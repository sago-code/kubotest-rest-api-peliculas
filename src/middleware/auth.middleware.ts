import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Database } from '../database';
import { Token } from '../entities/token.entity';
import { IsNull } from 'typeorm';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'El token hace falta o es invalido' });
        return;
    }

    try {
        const decodedToken = jwt.verify(token, 'your_jwt_secret') as { id: number };
        const tokenRepository = Database.getRepository(Token);
        const tokenEntity = await tokenRepository.findOne({ where: { token, deletedAt: IsNull() } });

        if (!tokenEntity) {
            res.status(403).json({ message: 'Token invalido o expirado' });
            return;
        }

        req.userId = decodedToken.id;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token invalido' });
    }
};