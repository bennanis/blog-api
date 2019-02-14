import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { BlackListJwtService } from './shared/black-list-jwt.service';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, BlackListJwtService],
})

export class AppModule {  
  constructor(private readonly connection: Connection) {}
}
