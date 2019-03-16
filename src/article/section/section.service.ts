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


}
