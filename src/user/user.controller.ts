import { Controller, Post, Body, UseGuards, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { request } from 'https';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('login')
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post('register')
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }

    @Get('t')
    @UseGuards(new AuthGaurd())
    allUsers(@Body() data: UserDTO){
        return 'rzrez';
    }
}
