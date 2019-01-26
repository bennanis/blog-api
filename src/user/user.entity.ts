import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { text } from "body-parser";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @Column('date')
    updated_at: Date;
}