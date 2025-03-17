import { Request, Response } from 'express';
import { CategoriesService } from '../services/categories.service';

const categoriesService = new CategoriesService();

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await categoriesService.getCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Error mostrando las categorias', error });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    const categoryId = parseInt(req.params.categoryId);
    try {
        const category = await categoriesService.getCategoryById(categoryId);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ message: 'Error mostrando la categoria', error });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    const { name } = req.body;
    try {
        await categoriesService.createCategory(name);
        return res.status(201).json({ message: 'Categoria creada' });
    } catch (error) {
        return res.status(500).json({ message: 'Error creando la categoria', error });
    }
}

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    const { name } = req.body;
    const categoryId = parseInt(req.query.categoryId as string);
    try {
        await categoriesService.updateCategory(categoryId, name);
        return res.status(200).json({ message: 'Categoria actualizada' });
    } catch (error) {
        return res.status(500).json({ message: 'Error actualizando la categoria', error });
    }
}