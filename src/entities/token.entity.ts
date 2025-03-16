import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;

    @ManyToOne(() => Users, user => user.token)
    user!: Users;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;
}