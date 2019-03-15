import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, NoteArticleEntity, CommentEntity } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleDTO, NoteArticleDto } from './article.dto';
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
        @InjectRepository(NoteArticleEntity)
        private noteArticleRepository: Repository<NoteArticleEntity>,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
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
        if(article.author.id == user.id){
            await this.articleRepository.delete(articleId);
            throw new HttpException('Delete successfully ! ', 200);
        } else {
            throw new HttpException('Delete : No permission ! ', 200);
        }
    }

    async noteArticle(loggedUserId:number, articleId: number, grade: number)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){throw new HttpException('Article not found ! ', 404);}

        if(article.author == user){
            throw new HttpException('Cant note your own article ! ', 404);
        } else {
            let hasVoted: NoteArticleEntity = await this.noteArticleRepository.findOne({user, article})
           
            // si l'utilisateur a déjà voter => on met à jour son vote
            if(hasVoted){
                hasVoted.grade = grade;
                await this.noteArticleRepository.update(hasVoted.id, hasVoted);
                throw new HttpException('Article note updated ! ', 200);
            } else {
                // sinon, on ajoute le vote
                let data = { user: user, article: article, grade: grade};
                let noteArticle = await this.noteArticleRepository.create(data);
                await this.noteArticleRepository.save(noteArticle);
                throw new HttpException('Article noted ! ', 200);
            }

        }
    }

    async commentArticle(loggedUserId:number, articleId: number, content: string)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){throw new HttpException('Article not found ! ', 404);}
        let comments = await this.commentRepository.create({author: user, article: article, content: content});
        await this.commentRepository.save(comments);
        throw new HttpException('Comment added successfully ! ', 200);
    }


}