import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, UpdateDateColumn, } from "typeorm";

import * as CryptoJS from 'crypto-js';

@Entity('user')
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({    
        type: "varchar",
        length: "255",
        unique: true,})
    email: string;

    @Column({    
        type: "varchar",
        length: "255",})
    password: string;

    @Column({    
        type: "varchar",
        length: "255",})
    first_name: string;

    @Column({    
        type: "varchar",
        length: "255",})
    last_name: string;

    @Column({    
        type: "varchar",
        length: "255",
        nullable: true,})
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    async beforeInsert(){
        /* Hash Password*/
        const hashPassword = await CryptoJS.MD5(this.password);
        this.password = hashPassword.toString();
    }

    toResponseObject() {
        const {id, email, avatar, created_at, updated_at } = this;
        return {id, email, avatar, created_at, updated_at };
    }
}