import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, NoteArticleEntity, CommentEntity } from './article.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { SectionController } from './section/section.controller';
import { SectionService } from './section/section.service';
import { SectionEntity } from './section/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, NoteArticleEntity, CommentEntity, SectionEntity]), UserModule],
  controllers: [ArticleController, SectionController],
  providers: [ArticleService, SectionService]
})
export class ArticleModule {}
