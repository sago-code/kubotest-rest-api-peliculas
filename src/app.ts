import express, { Application } from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import { Database } from './database/database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import categoriesRoutes from './routes/categories.routes';
import moviesRoutes from './routes/movies.routes';
import moviesViewsRoutes from './routes/moviesViews.routes'; // Importar la nueva ruta

export class App {

    private app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }
    
    routes() {
        this.app.use('/users', userRoutes);
        this.app.use('/auth', authRoutes);
        this.app.use('/categories', categoriesRoutes);
        this.app.use('/movies', moviesRoutes);
        this.app.use('/movies-views', moviesViewsRoutes);
    }

    async listen() {
        await Database.initialize();
        await this.app.listen(this.app.get('port'));
        const port = this.app.get('port');
        console.log(chalk.blue.bold(`
            ******************************************
            *                                        *
            *     🎬 Bienvenido a la API de Películas 🎬    *
            *                                        *
            * `) + chalk.green.bold(`    🚀 Servidor en puerto: ${port} 🚀            `) + chalk.blue.bold(`*
            *                                        *
            ******************************************`
        ));
    }
}