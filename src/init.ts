import { Database } from './database/database';
import { Categories } from './entities/categories.entity';

const preloadCategories = async () => {
    const categoryRepository = Database.getRepository(Categories);

    const categories = ['Terror', 'Suspenso', 'Drama', 'Comedia'];

    for (const name of categories) {
        const categoryExists = await categoryRepository.findOneBy({ name });
        if (!categoryExists) {
            const category = categoryRepository.create({ name });
            await categoryRepository.save(category);
        }
    }
};

export default preloadCategories;