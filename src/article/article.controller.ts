import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO, NoteArticleDto } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { isNumber } from 'util';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('article')
export class ArticleController {
    constructor(private readonly userService: UserService, private articleService: ArticleService){}

    @Post()
    @UseGuards(new AuthGaurd())
    async create(@Body() articleData: ArticleDTO){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.articleService.create(logguedUser.id, articleData);
    }

    @Get(':articleId')
    async getById(@Param('articleId') articleId:number){
        return this.articleService.getById(articleId);
    }

    @Get('/all/:offset')
    async getAll(@Param('offset') offset:number){
        return await this.articleService.getAll(offset);
    }

    @Get('/allMine')
    @UseGuards(new AuthGaurd())
    async getAllMine(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return await this.articleService.getAllMine(logguedUser.id);
    }
    
    @Put(':articleId')
    @UseGuards(new AuthGaurd())
    async update(@Param('articleId') articleId: number, @Body() articleData: Partial<ArticleDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }


        return this.articleService.update(logguedUser.id, articleId, articleData) ;
    }  

    @Delete(':articleId')
    @UseGuards(new AuthGaurd())
    async delete(@Param('articleId') articleId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        
        return this.articleService.delete(logguedUser.id, articleId) ;
    }
    
    @Post(':articleId/note')
    @UseGuards(new AuthGaurd())
    async noteArticle(@Param('articleId') articleId: number, @Body() data: NoteArticleDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }

        if(!data.grade || !isNumber(data.grade) ){
            throw new HttpException('Grade not defined', 404);
        }
        return this.articleService.noteArticle(logguedUser.id, articleId, data.grade) ;
    }

    @Post(':articleId/comment')
    @UseGuards(new AuthGaurd())
    async addCommentArticle(@Param('articleId') articleId: number, @Body() data: any){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.articleService.addCommentArticle(logguedUser.id, articleId, data.content);
    }

    @Delete('/comment/:commentId')
    @UseGuards(new AuthGaurd())
    async deleteCommentArticle(@Param('commentId') commentId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        
        return this.articleService.deleteCommentArticle(logguedUser.id, commentId) ;
    }

    @Post('/comment/:commentId')
    @UseGuards(new AuthGaurd())
    async addCommentComment(@Param('commentId') commentId: number, @Body() data: any){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }

        return this.articleService.addCommentComment(logguedUser.id, commentId, data.content) ;
    }

    @Post('/comment/:commentId/:typeLike')
    @UseGuards(new AuthGaurd())
    async noteCommentArticle(@Param('commentId') commentId: number, @Param('typeLike') typeLike: string){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        if(typeLike == 'like' || typeLike == 'dislikes'){
            return this.articleService.noteCommentArticle(logguedUser.id, commentId, typeLike) ;
        } else {
            throw new HttpException('Erreur', 404);
        }
    }

}
