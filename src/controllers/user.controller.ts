import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

const userService = new UserService();

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    try {
        await userService.createUser(name, email, password);
        return res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear usuario', error });
    }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { newPassword } = req.body;
    const userId = parseInt(req.query.id as string);

    if (!userId) {
        return res.status(400).json({ message: 'ID de Usuario requerido' });
    }

    if (req.userId !== userId) {
        return res.status(403).json({ message: 'Este usuario no tiene sesion activa' });
    }

    if (!newPassword) {
        return res.status(400).json({ message: 'Nueva clave requerida' });
    }

    try {
        await userService.updatePassword(userId, newPassword);
        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
};