import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, NoteArticleEntity, CommentEntity } from './article.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, NoteArticleEntity, CommentEntity]), UserModule],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
