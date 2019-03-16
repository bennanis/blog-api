import { UserEntity } from "src/user/user.entity";
import { ArticleEntity } from "../article.entity";


export class SectionDTO {
    id: number;
    titre: string;
    user: UserEntity;
    articles: ArticleEntity[];
    created_at: Date;
    updated_at: Date;
}

