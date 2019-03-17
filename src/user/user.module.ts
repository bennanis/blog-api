import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthController } from './auth/auth.controller';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController, AuthController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}
