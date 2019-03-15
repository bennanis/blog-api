import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, ManyToOne} from "typeorm";

import { ArticleDTO } from "./article.dto";
import { UserEntity } from "src/user/user.entity";
import { userInfo } from "os";

@Entity('article')
export class ArticleEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: "255", nullable: false})
    titre: string;

    @Column({type: "text", nullable: false})
    content: string;

    @Column({type: "int", default: 0})
    likes: number;

    @Column({type: "int", default: 0})
    disLikes: number;

    @Column({type: "varchar", length: "255", nullable: true})
    picture: string;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    author: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    toResponseObject() {
        const {id, titre, content, likes, disLikes, picture, author, created_at, updated_at} = this;
        let responseObject:ArticleDTO = {id, titre, content, likes, disLikes, picture, author, created_at, updated_at};
        return responseObject;  
    }

}


@Entity('note-article')
export class NoteArticle {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @OneToOne(type => ArticleEntity)
    @JoinColumn()
    article: ArticleEntity;

    @Column({type: "int", default: 0})
    grade: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}