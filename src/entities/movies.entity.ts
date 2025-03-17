import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { MovieCategories } from './movieCategories';
import { MoviesViews } from './moviesViews.entity';

@Entity()
export class Movies {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'varchar', length: 50 })
    director: string;

    @Column()
    releaseDate: Date;

    @Column({ type: 'varchar', length: 50 })
    year: string;

    @Column({ type: 'time' })
    duration: string;

    @Column({ type: 'decimal', precision: 3, scale: 1 })
    ratingValue: number;

    @Column({ type: 'tinyint' })
    ratingSuffix: number;

    @OneToMany(() => MovieCategories, movieCategories => movieCategories.movie)
    movieCategories: MovieCategories[];

    @OneToMany(() => MoviesViews, movieViews => movieViews.movie)
    views: MoviesViews[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
