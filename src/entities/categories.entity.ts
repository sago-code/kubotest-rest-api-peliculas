import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { MovieCategories } from './movieCategories';

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @OneToMany(() => MovieCategories, movieCategories => movieCategories.category)
    movieCategories!: MovieCategories[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
