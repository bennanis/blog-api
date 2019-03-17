import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ArticleModule, AdminModule],
  controllers: [],
  providers: [UserService]
})

export class AppModule {  
  constructor(private readonly connection: Connection) {}
}
