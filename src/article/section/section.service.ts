import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../article.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { SectionEntity } from './section.entity';
import { SectionDTO } from './section.dto';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(SectionEntity)
        private sectionRepository: Repository<SectionEntity>,
        private userService: UserService
    ) {}


    async getAll(loggedUserId:number){
        let user: UserEntity = await this.userRepository.findOne(loggedUserId);
        return await this.sectionRepository.find({where: {user: user}});
    }

    async create(loggedUserId:number, dataSection:Partial<SectionDTO>)
    {

        let user: UserEntity = await this.userRepository.findOne(loggedUserId);
        if(!dataSection.titre){
            throw new HttpException('Error ! ', 404);
        }
        dataSection.user = user;
        let section = await this.sectionRepository.create(dataSection);
        await this.sectionRepository.save(section);

        throw new HttpException('create successfully ! ', 200);
    }

    async delete(loggedUserId:number, sectionId: number){
        let section: SectionEntity = await this.sectionRepository.findOne(sectionId, {relations: ["user"]});
        if(!section)
            throw new HttpException('Section not found ! ', 404);
        if(section.user.id !== loggedUserId)
            throw new HttpException('Error permissions ', 404)
        
        await this.sectionRepository.delete(sectionId);
        throw new HttpException('Delete successfully ! ', 200);
    }

    async addArticleSection(loggedUserId:number, idSection:number, idArticle:number){
        let section: SectionEntity = await this.sectionRepository.findOne(idSection,  { relations: ["user", "articles"] });
        let article: ArticleEntity = await this.articleRepository.findOne(idArticle);

        if(!section)
            throw new HttpException('Section not found ! ', 404);
        if(section.user.id !== loggedUserId)
            throw new HttpException('Error permissions ', 404)
        if(!article)
            throw new HttpException('Article not found ! ', 404);

        // Tout les articles de la rubrique : idSection
        let articlesInSection: ArticleEntity[] = section.articles;
        for(let i = 0; i<articlesInSection.length; i++){
            // Si l'article est déjà présent dans cette rubrique, renvoie erreur
            if(articlesInSection[i].id == idArticle)
                throw new HttpException('Error ! ', 404);
        }
        this.sectionRepository.createQueryBuilder('')
        .relation(SectionEntity, "articles")
        .of(section)
        .add(article);
        throw new HttpException('Article added to section ! ', 404);

    }


}
