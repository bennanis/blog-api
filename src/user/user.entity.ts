import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, UpdateDateColumn, Any, OneToMany, } from "typeorm";

import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { UserDTO, UserInfoDTO, UserLoginDTO } from "./user.dto";
import { CommentEntity, ArticleEntity } from "src/article/article.entity";

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

    @OneToMany(type => ArticleEntity, articles => articles.author)
    articles: ArticleEntity[];

    // un utilisateur peut avoir plusieurs commentaires
    @OneToMany(type => CommentEntity, comments => comments.author)
    comments: CommentEntity[];

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

    toResponseObject(showToken = false) {
        const {id, email, avatar, first_name, last_name, created_at, is_author, type, updated_at, token} = this;
        if(showToken){
            let responseObject:UserLoginDTO = {id, email, first_name, last_name, avatar, is_author, type, created_at, updated_at, token};
            return responseObject;  
        }else {
            let responseObject:UserInfoDTO = {id, email, first_name, last_name, avatar, is_author, type, created_at, updated_at};
            return responseObject;  
        }
    }

    private get token(){
        const { id, email } = this;
        return jwt.sign({id,email}, 'mySalt', {expiresIn: '24h'})
    }
}