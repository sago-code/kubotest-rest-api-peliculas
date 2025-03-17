import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Movies } from './movies.entity';
import { Users } from './user.entity';

@Entity()
export class MoviesViews {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movies, movie => movie.views)
    movie!: Movies;

    @ManyToOne(() => Users, user => user.views)
    user!: Users;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    viewIn!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}