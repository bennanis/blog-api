import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, UpdateDateColumn, Any, } from "typeorm";

import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

export enum UserRole {
    ADMIN = "admin",
    AUTHOR = "author",
    STANDARD = "standard"
}

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

    @Column({
        name: "is_author",
        type: "boolean",
        default: false
    })
    is_author: boolean;

    @Column({
        name: "type",
        type: "enum",
        enum: UserRole,
        default: UserRole.STANDARD
    })
    type: UserRole

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
    
    async comparePassword(pass: string){
        const hashPass = await CryptoJS.MD5(pass);
        if(this.password == hashPass.toString())
            return true;
        else
            return false;
    }

    toResponseObject(showToken: boolean = true) {
        const {id, email, avatar, created_at, is_author, type, updated_at, token} = this;
        let responseObject:any = {id, email, avatar, is_author, type, created_at, updated_at};

        if(showToken)
            responseObject.token = token;

        return responseObject;  
    }

    private get token(){
        const { id, email } = this;
        return jwt.sign({id,email}, 'mySalt', {expiresIn: '24h'})
    }
}