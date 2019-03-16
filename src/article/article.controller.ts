import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete, Get, Query, Guard } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO, NoteArticleDto } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { isNumber } from 'util';
import { async } from 'rxjs/internal/scheduler/async';
import { RoleGuard } from 'src/user/guards/role.guard';
import { UserRole } from 'src/user/user.entity';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('article')
@UseGuards(RoleGuard)
export class ArticleController {
    constructor(private readonly userService: UserService, private articleService: ArticleService){}

    @Post()
    @Roles(UserRole.AUTHOR)
    async create(@Body() articleData: ArticleDTO){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.create(logguedUser.id, articleData);
    }

    @Get('/allMine')
    @Roles(UserRole.AUTHOR)
    async getAllMine(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return await this.articleService.getAllMine(logguedUser.id);
    }

    @Get(':articleId')
    async getById(@Param('articleId') articleId:number){
        return this.articleService.getById(articleId);
    }

    @Get('/all/:offset')
    async getAll(@Param('offset') offset:number){
        return await this.articleService.getAll(offset);
    }

    
    @Put(':articleId')
    @Roles(UserRole.AUTHOR)
    async update(@Param('articleId') articleId: number, @Body() articleData: Partial<ArticleDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.update(logguedUser.id, articleId, articleData) ;
    }  

    @Delete(':articleId')
    @Roles(UserRole.AUTHOR)
    async delete(@Param('articleId') articleId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.delete(logguedUser.id, articleId) ;
    }
    
    @Post(':articleId/note')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async noteArticle(@Param('articleId') articleId: number, @Body() data: NoteArticleDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();

        if(!data.grade || !isNumber(data.grade) ){
            throw new HttpException('Grade not defined', 404);
        }
        return this.articleService.noteArticle(logguedUser.id, articleId, data.grade) ;
    }

    @Post(':articleId/comment')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async addCommentArticle(@Param('articleId') articleId: number, @Body() data: any){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.addCommentArticle(logguedUser.id, articleId, data.content);
    }

    @Delete('/comment/:commentId')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async deleteCommentArticle(@Param('commentId') commentId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.deleteCommentArticle(logguedUser.id, commentId) ;
    }

    @Post('/comment/:commentId')
    @Roles(UserRole.AUTHOR)
    async addCommentComment(@Param('commentId') commentId: number, @Body() data: any){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.addCommentComment(logguedUser.id, commentId, data.content) ;
    }

    @Post('/comment/:commentId/:typeLike')
    @Roles(UserRole.AUTHOR)
    async noteCommentArticle(@Param('commentId') commentId: number, @Param('typeLike') typeLike: string){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();

        if(typeLike == 'like' || typeLike == 'dislikes'){
            return this.articleService.noteCommentArticle(logguedUser.id, commentId, typeLike) ;
        } else {
            throw new HttpException('Erreur', 404);
        }
    }

}
