import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete, Get, Query, Guard } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO, NoteArticleDto, CommentDto } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { isNumber } from 'util';
import { async } from 'rxjs/internal/scheduler/async';
import { RoleGuard } from 'src/user/guards/role.guard';
import { UserRole } from 'src/user/user.entity';
import { Roles } from 'src/user/decorators/roles.decorator';
import { ApiUseTags, ApiResponse, ApiImplicitBody, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';

@Controller('article')
@UseGuards(RoleGuard)
export class ArticleController {
    constructor(private readonly userService: UserService, private articleService: ArticleService){}

    @Post()
    @Roles(UserRole.AUTHOR)
    @ApiUseTags('article')
    async create(@Body() articleData: ArticleDTO){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.create(logguedUser.id, articleData);
    }

    @Get('/allMine')
    @Roles(UserRole.AUTHOR)
    @ApiUseTags('article')
    async getAllMine(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return await this.articleService.getAllMine(logguedUser.id);
    }

    @Get('/allHidden')
    @ApiUseTags('article')
    @Roles(UserRole.AUTHOR, UserRole.ADMIN)
    async getAllHidden(){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return await this.articleService.getAllHidden(logguedUser.id);
    }

    @Put('/:articleId/hide')
    @ApiUseTags('article')
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article qu'on veut cacher."})
    @Roles(UserRole.AUTHOR)
    async hideArticle(@Param('articleId') articleId: number){
        return this.articleService.showHideArticle(articleId, "hide") ;
    }

    @Put('/:articleId/show')
    @ApiUseTags('article')
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article qu'on veut afficher."})
    @Roles(UserRole.AUTHOR)
    async showArticle(@Param('articleId') articleId: number){
        return this.articleService.showHideArticle(articleId, "show") ;
    }

    @Get(':articleId')
    @ApiUseTags('article')
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article qu'on veut récupérer."})
    async getById(@Param('articleId') articleId:number){
        return this.articleService.getById(articleId);
    }

    @Get('/all/:offset')
    @ApiUseTags('article')
    @ApiImplicitParam({ name: "offset", description: "Nombre de décallage sur le résultat (Limit +=20)."})
    async getAll(@Param('offset') offset:number){
        return await this.articleService.getAll(offset);
    }

    
    @Put(':articleId')
    @ApiUseTags('article')
    @ApiImplicitBody({ name: "articleData", required: true, type: ArticleDTO})
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article à mettre à jour."})
    @Roles(UserRole.AUTHOR)
    async update(@Param('articleId') articleId: number, @Body() articleData: Partial<ArticleDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.update(logguedUser.id, articleId, articleData) ;
    }  

    @Delete(':articleId')
    @ApiUseTags('article')
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article à supprimer."})
    @Roles(UserRole.AUTHOR)
    async delete(@Param('articleId') articleId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.delete(logguedUser.id, articleId) ;
    }
    
    /* */
    @Post(':articleId/note')
    @ApiUseTags('Notation article')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async noteArticle(@Param('articleId') articleId: number, @Body() data: NoteArticleDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();

        if(!data.grade || !isNumber(data.grade) ){
            throw new HttpException('Grade not defined', 404);
        }
        return this.articleService.noteArticle(logguedUser.id, articleId, data.grade) ;
    }

    /* */

    @Post(':articleId/comment')
    @ApiUseTags('Commentaire article')
    @ApiImplicitParam({ name: "articleId", description: "Id de l'article dans le quel on veut rajouter le commentaire."})
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async addCommentArticle(@Param('articleId') articleId: number, @Body() commentData: CommentDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.addCommentArticle(logguedUser.id, articleId, commentData);
    }

    @Delete('/comment/:commentId')
    @ApiUseTags('Commentaire article')
    @ApiImplicitParam({ name: "commentId", description: "Id du commentaire qu'on veut supprimer."})
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async deleteCommentArticle(@Param('commentId') commentId: number){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.deleteCommentArticle(logguedUser.id, commentId) ;
    }

    @Post('/comment/:commentId')
    @ApiUseTags('Commentaire article')
    @ApiImplicitParam({ name: "commentId", description: "Id du commentaire que l'auteur veut commenter."})
    @Roles(UserRole.AUTHOR)
    async addCommentComment(@Param('commentId') commentId: number, @Body() commentData: CommentDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.articleService.addCommentComment(logguedUser.id, commentId, commentData) ;
    }

    @Post('/comment/:commentId/:typeLike')
    @ApiUseTags('Commentaire article')
    @ApiImplicitParam({ name: "commentId", description: "Id du commentaire que l'auteur veut noter."})
    @ApiImplicitParam({ name: "typeLike", description: "Type de notation : 'like' | 'dislike'."})
    @Roles(UserRole.AUTHOR)
    async noteCommentArticle(@Param('commentId') commentId: number, @Param('typeLike') typeLike: string){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();

        if(typeLike == 'like' || typeLike == 'dislike'){
            return this.articleService.noteCommentArticle(logguedUser.id, commentId, typeLike) ;
        } else {
            throw new HttpException('Missing information !', 404);
        }
    }

}
