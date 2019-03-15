import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleDTO } from './article.dto';
import { UserService } from 'src/user/user.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userService: UserService
    ) {}

    async create(loggedUserId:number, data: ArticleDTO)
    {
        if(!data.titre || !data.content)
            throw new HttpException('Missing information !', 404);

        let user: UserEntity = await this.userRepository.findOne(loggedUserId);
        data.author = user;
        let article = await this.articleRepository.create(data);
        await this.articleRepository.save(article);

        throw new HttpException('create successfully ! ', 200);
    }

    async delete(loggedUserId:number, articleId: number)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){
            throw new HttpException('Article not found ! ', 200);
        }
        if(article.author == user){
            await this.articleRepository.delete(articleId);
            throw new HttpException('Delete successfully ! ', 200);
        } else {
            throw new HttpException('Delete : No permission ! ', 200);
        }
    }

}
