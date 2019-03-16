import { Controller, Post, UseGuards, Body, HttpException, Param, Get, Delete } from '@nestjs/common';
import { ArticleService } from '../article.service';
import { UserService } from 'src/user/user.service';
import { SectionService } from './section.service';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { UserInfoDTO } from 'src/user/user.dto';
import { SectionDTO } from './section.dto';

@Controller('section')
export class SectionController {
    constructor(private readonly userService: UserService,
        private sectionService: SectionService){}

    @Post()
    @UseGuards(new AuthGaurd())
    async create(@Body() sectionData: Partial<SectionDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.sectionService.create(logguedUser.id, sectionData);
    }

    @Delete(':idSection')
    @UseGuards(new AuthGaurd())
    async delete(@Param("idSection") idSection:number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.sectionService.delete(logguedUser.id, idSection);
    }

    @Post(':idSection/:idArticle')
    @UseGuards(new AuthGaurd())
    async addArticleSection(@Param("idSection") idSection:number, @Param("idArticle") idArticle:number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.sectionService.addArticleSection(logguedUser.id, idSection, idArticle);
    }

    @Get('/all')
    @UseGuards(new AuthGaurd())
    async getAll(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return await this.sectionService.getAll(logguedUser.id);
    }

}
