import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO, NoteArticleDto } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { async } from 'rxjs/internal/scheduler/async';
import { isNumber } from 'util';

@Controller('article')
export class ArticleController {
    constructor(private readonly userService: UserService, private articleService: ArticleService){}

    @Post()
    @UseGuards(new AuthGaurd())
    async create(@Body() data: ArticleDTO){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.articleService.create(logguedUser.id, data);
    }
    
    @Delete(':id')
    @UseGuards(new AuthGaurd())
    async delete(@Param('id') articleId){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        
        return this.articleService.delete(logguedUser.id, articleId) ;
    }
    
    @Post('note/:articleId')
    @UseGuards(new AuthGaurd())
    async noteArticle(@Param('articleId') articleId, @Body() data: NoteArticleDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }

        if(!data.grade || !isNumber(data.grade) ){
            throw new HttpException('Grade not defined', 404);
        }
        return this.articleService.noteArticle(logguedUser.id, articleId, data.grade) ;

    }
}
