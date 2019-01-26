import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';


@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})

export class AppModule {  
  constructor(private readonly connection: Connection) {}
}
