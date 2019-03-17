import { ArticleEntity } from "./article.entity";
import { UserEntity } from "src/user/user.entity";


export class ArticleDTO {
    id: number;
    titre: string;
    content: string;
    likes: number;
    disLikes: number;
    picture: string;
    author: UserEntity;
    hidden: boolean;
    created_at: Date;
    updated_at: Date;
}


export class NoteArticleDto {
    id: number;
    userId: UserEntity;
    articleId: ArticleEntity;
    grade: number
    created_at: Date;
    updated_at: Date;
}