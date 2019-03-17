import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm";

import { ArticleDTO } from "./article.dto";
import { UserEntity } from "src/user/user.entity";
import { SectionEntity } from "./section/section.entity";

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
    author: UserEntity;

    @OneToMany(type => CommentEntity, comment => comment.article, {
        eager: true
    })
    comments: CommentEntity[];

    @ManyToMany(type => SectionEntity, section => section.articles)
    sections: SectionEntity[];

    @Column({default: false})
    hidden: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    toResponseObject() {
        const {id, titre, content, likes, disLikes, picture, author, hidden, created_at, updated_at} = this;
        let responseObject:ArticleDTO = {id, titre, content, likes, disLikes, picture, author, hidden, created_at, updated_at};
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
    @ManyToOne(type => UserEntity, author => author.comments)
    @JoinColumn({ name: "user_id" })
    author: UserEntity;

    // plusieurs commentaires peuvent être posséder par un article
    @ManyToOne(type => ArticleEntity, article => article.comments)
    @JoinColumn({ name: "article_id" })
    article: ArticleEntity;    

    @OneToOne(type => CommentEntity)
    @JoinColumn({ name: "parent_id" })
    parent_id: CommentEntity;

    @Column({type: "int", default: 0})
    likes: number;

    @Column({type: "int", default: 0})
    disLikes: number;

    @Column({type: "text", nullable: false})
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}