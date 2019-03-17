import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

    async getById(articleId:number){
        let article: ArticleEntity = await this.articleRepository.findOne(articleId, {relations: ["author", "comments"]});
        return article;
    }

    async getAll(offset:number){
        offset = Number(offset);
        let limit: number = offset+20;
      return await this.articleRepository.createQueryBuilder("article")
        .select(["article.id", "article.titre", "article.created_at"])
        .leftJoinAndSelect("article.author", "user")
        .leftJoinAndSelect("article.comments", "comments")
        .offset(offset)
        .limit(limit)
        .orderBy("article.created_at", "DESC")
        .getMany();
    }

    async getAllMine(loggedUserId: number){
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);
        return await this.articleRepository.createQueryBuilder("article")
        .leftJoinAndSelect("article.comments", "comments")
        .where({author: user})
        .orderBy("article.created_at", "DESC")
        .getMany();
    }

    async update(loggedUserId: number, articleId: number, articleData: Partial<ArticleDTO>)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);

        if(!article){
            throw new HttpException('Article not found ! ', HttpStatus.NOT_FOUND);
        }

        if((article.author == null) || (article.author.id !== loggedUserId)){
            throw new HttpException('Permission denied ! ', HttpStatus.UNAUTHORIZED);
        }

        if(articleData.content)
            article.content = articleData.content;
        if(articleData.titre)
            article.titre = articleData.titre;
        if(articleData.picture)
            article.picture = articleData.picture;

        await this.articleRepository.update(articleId, article);

        throw new HttpException('Success update !', HttpStatus.CREATED);
    }

    async delete(loggedUserId:number, articleId: number)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){
            throw new HttpException('Article not found ! ', HttpStatus.NOT_FOUND);
        }
        if((article.author !== undefined) && (article.author.id == user.id)){
            await this.articleRepository.delete(articleId);
            throw new HttpException('Delete successfully ! ', HttpStatus.OK);
        } else {
            throw new HttpException('Delete : No permission ! ', HttpStatus.UNAUTHORIZED);
        }
    }

    async noteArticle(loggedUserId:number, articleId: number, grade: number)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){throw new HttpException('Article not found ! ', HttpStatus.NOT_FOUND);}

        if(article.author == user){
            throw new HttpException('Cant note your own article ! ', HttpStatus.UNAUTHORIZED);
        } else {
            let hasVoted: NoteArticleEntity = await this.noteArticleRepository.findOne({user, article})
           
            // si l'utilisateur a déjà voter => on met à jour son vote
            if(hasVoted){
                hasVoted.grade = grade;
                await this.noteArticleRepository.update(hasVoted.id, hasVoted);
                throw new HttpException('Article note updated ! ', HttpStatus.CREATED);
            } else {
                // sinon, on ajoute le vote
                let data = { user: user, article: article, grade: grade};
                let noteArticle = await this.noteArticleRepository.create(data);
                await this.noteArticleRepository.save(noteArticle);
                throw new HttpException('Article noted ! ', HttpStatus.OK);
            }

        }
    }

    async addCommentArticle(loggedUserId:number, articleId: number, content: string)
    {
        let article: ArticleEntity = await this.articleRepository.findOne(articleId);
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        if(!article){throw new HttpException('Article not found ! ', HttpStatus.NOT_FOUND);}
        let comments = await this.commentRepository.create({author: user, article: article, content: content});
        await this.commentRepository.save(comments);
        throw new HttpException('Comment added successfully ! ', HttpStatus.CREATED);
    }

    async deleteCommentArticle(loggedUserId:number, commentId: number)
    {
        let comment: CommentEntity = await this.commentRepository.findOne(commentId, { relations: ["author"] });
        if(!comment){throw new HttpException('Comment not found ! ', HttpStatus.NOT_FOUND);}
    
        if(comment.author.id == loggedUserId){
            await this.commentRepository.delete(commentId);
            throw new HttpException('Delete successfully ! ', HttpStatus.OK);
        } else {
            throw new HttpException('Delete : No permission ! ', HttpStatus.UNAUTHORIZED);
        }

    }

    async addCommentComment(loggedUserId:number, commentId: number, content: string)
    {
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        // Récupérer le commentaire
        let comment: CommentEntity = await this.commentRepository.findOne(commentId, { relations: ["article"] });
        if(!comment){throw new HttpException('Comment not found ! ', HttpStatus.NOT_FOUND);}

        let hasParent: number = await this.commentRepository.count({where: {parent_id: commentId}});

        // Si le commentaire à déja un parent => renvoie msg d'erreur
        if(hasParent){throw new HttpException('You can not add more than one comment ! ', HttpStatus.UNAUTHORIZED);}
            
        // Récupérer l'artcile ou se trouve le commentaire
        let article: ArticleEntity = await this.articleRepository.findOne(comment.article.id)
        if(article.author === null)
            throw new HttpException('Add comment : No permission ! ', HttpStatus.UNAUTHORIZED);

        if(article.author.id == loggedUserId){
            let commentAdd = await this.commentRepository.create({author: user, article: article, content: content, parent_id: comment});
            await this.commentRepository.save(commentAdd);
            throw new HttpException('Comment added successfully ! ', HttpStatus.OK);
        } else {
            throw new HttpException('Add comment : No permission ! ', HttpStatus.UNAUTHORIZED);
        }
    }

    async noteCommentArticle(loggedUserId:number, commentId: number, typeLike: string)
    {
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);

        // Récupérer le commentaire
        let comment: CommentEntity = await this.commentRepository.findOne(commentId, { relations: ["article"] });
        if(!comment){throw new HttpException('Comment not found ! ', HttpStatus.NOT_FOUND);}
            
        // Récupérer l'artcile ou se trouve le commentaire
        let article: ArticleEntity = await this.articleRepository.findOne(comment.article.id)

        if(article.author.id == loggedUserId){
            if(typeLike == 'like'){
                comment.likes = 1;
                comment.disLikes = 0;
            } else if(typeLike == 'dislike'){
                comment.disLikes = 1;
                comment.likes = 0;
            }
            await this.commentRepository.update(commentId, comment);
            throw new HttpException('Comment noted successfully ! ', HttpStatus.OK);
        } else {
            throw new HttpException('No permission ! ', HttpStatus.UNAUTHORIZED);
        }
    }
    

}
