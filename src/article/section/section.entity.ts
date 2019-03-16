import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm";

import { UserEntity } from "src/user/user.entity";
import { ArticleEntity } from "../article.entity";

@Entity('section')
export class SectionEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: "255", nullable: false})
    titre: string;

    @ManyToOne(type => UserEntity, user => user.sections)
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


}
