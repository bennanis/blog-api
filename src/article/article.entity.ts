import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import { ArticleDTO } from "./article.dto";
import { UserEntity } from "src/user/user.entity";

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

    @ManyToOne(type => UserEntity, user => user.articles, {
        eager: true
    })
    @JoinColumn()
    author: UserEntity;

    @OneToMany(type => CommentEntity, comments => comments.author)
    comments: CommentEntity[];

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
export class NoteArticleEntity {
    
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

@Entity('comment')
export class CommentEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    // plusieurs commentaires peuvent être posséder par un utilisateur
    @ManyToOne(type => UserEntity, author => author.comments, {
        eager: true
    })
    author: UserEntity;

    // plusieurs commentaires peuvent être posséder par un article
    @ManyToOne(type => ArticleEntity, article => article.comments, {
        eager: true
    })
    article: UserEntity;    

    @Column({type: "text", nullable: false})
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}