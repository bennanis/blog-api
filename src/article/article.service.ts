import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleDTO } from './article.dto';
import { UserService } from 'src/user/user.service';
import { UserInfoDTO } from 'src/user/user.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>, private userService: UserService
    ) {}

    async create(data: ArticleDTO)
    {
        if(!data.titre || !data.content)
            throw new HttpException('Missing information !', 404);

        let article = await this.articleRepository.create(data);
        await this.articleRepository.save(article);

        throw new HttpException('create successfully ! ', 200);
    }

    async delete(loggedUserId:number, articleId: number)
    {
        let article: ArticleDTO = await this.articleRepository.findOne(articleId);
        if(!article){
            throw new HttpException('Article not found ! ', 200);
        }
        if(article.author == loggedUserId){
            await this.articleRepository.delete(articleId);
            throw new HttpException('Delete successfully ! ', 200);
        } else {
            throw new HttpException('Delete : No permission ! ', 200);
        }
    }

}
