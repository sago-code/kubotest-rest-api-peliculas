import { DataSource } from 'typeorm';
import preloadCategories from './init';

export const Database = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    database: 'peliculas',
    synchronize: false,
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"]
});

Database.initialize()
    .then(async () => {
        console.log('Data Source ha sido inicializado!');
        await preloadCategories();
    })
    .catch((error) => console.log('Error durante la inicializacion del Data Source', error));