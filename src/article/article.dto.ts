import { ArticleEntity } from "./article.entity";
import { UserEntity } from "src/user/user.entity";
import { ApiModelProperty } from "@nestjs/swagger";


export class ArticleDTO {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    titre: string;

    @ApiModelProperty()
    content: string;

    @ApiModelProperty()
    likes: number;

    @ApiModelProperty()
    disLikes: number;

    @ApiModelProperty()
    picture: string;

    @ApiModelProperty()
    author: UserEntity;

    @ApiModelProperty()
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