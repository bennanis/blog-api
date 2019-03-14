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

}
