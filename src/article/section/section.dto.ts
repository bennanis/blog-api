import { UserEntity } from "src/user/user.entity";
import { ArticleEntity } from "../article.entity";
import { ApiModelProperty } from "@nestjs/swagger";


export class SectionDTO {
    id: number;

    @ApiModelProperty()
    titre: string;

    user: UserEntity;

    articles: ArticleEntity[];

    created_at: Date;
    
    updated_at: Date;
}

