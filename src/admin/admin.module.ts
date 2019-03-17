import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [UserModule, ArticleModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
