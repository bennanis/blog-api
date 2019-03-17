import { Controller, Post, UseGuards, Body, HttpException, Param, Get, Delete } from '@nestjs/common';
import { ArticleService } from '../article.service';
import { UserService } from 'src/user/user.service';
import { SectionService } from './section.service';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { UserInfoDTO } from 'src/user/user.dto';
import { SectionDTO } from './section.dto';
import { UserRole } from 'src/user/user.entity';
import { Roles } from 'src/user/decorators/roles.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { ApiUseTags, ApiImplicitParam, ApiImplicitBody } from '@nestjs/swagger';

@Controller('section')
@UseGuards(RoleGuard)
export class SectionController {
    constructor(private readonly userService: UserService,
        private sectionService: SectionService){}

    @Post()
    @ApiUseTags('Section article')
    @ApiImplicitBody({ name: "sectionData", required: true, type: SectionDTO})
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async create(@Body() sectionData: Partial<SectionDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.sectionService.create(logguedUser.id, sectionData);
    }

    @Delete(':idSection')
    @ApiUseTags('Section article')
    @ApiImplicitParam({ name: "idSection", description: "Id de la rubrique qu'on veut supprimer."})
    
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async delete(@Param("idSection") idSection:number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.sectionService.delete(logguedUser.id, idSection);
    }

    @Post(':idSection/:idArticle')
    @ApiUseTags('Section article')
    @ApiImplicitParam({ name: "idSection", description: "Id de la rubrique dans la quelle on veut ajouter l'article."})
    @ApiImplicitParam({ name: "idArticle", description: "Id de l'artcile qu'on veut ajouter la rubrique."})
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async addArticleSection(@Param("idSection") idSection:number, @Param("idArticle") idArticle:number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.sectionService.addArticleSection(logguedUser.id, idSection, idArticle);
    }

    @Get('/all')
    @ApiUseTags('Section article')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async getAll(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return await this.sectionService.getAll(logguedUser.id);
    }

}
