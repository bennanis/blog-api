import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

import { ArticleDTO } from "./article.dto";

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

    @Column({type: "int", nullable: false})
    author: number;

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