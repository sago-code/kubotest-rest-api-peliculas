import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Movies } from './movies.entity';
import { Categories } from './categories.entity';

@Entity()
export class MovieCategories {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Movies, movie => movie.movieCategories)  
    movie!: Movies;

    @ManyToOne(() => Categories, category => category.movieCategories)
    category!: Categories;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
        createdAt!: Date;
    
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}

