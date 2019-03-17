import { ArticleEntity, CommentEntity } from "./article.entity";
import { UserEntity } from "src/user/user.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class ArticleDTO {
    id: number;

    @ApiModelProperty()
    titre: string;

    @ApiModelProperty()
    content: string;

    likes: number;

    disLikes: number;

    @ApiModelProperty()
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


export class CommentDto {
    id: number;

    author: UserEntity;

    article: ArticleEntity;

    parent_id: CommentEntity;

    like: number;

    disLikes: number;

    @ApiModelProperty()
    content: string;

    created_at: Date;

    updated_at: Date;
}
