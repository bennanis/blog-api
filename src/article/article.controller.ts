import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';

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
        data.author = logguedUser.id;
        return this.articleService.create(data);
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
}
