import { Controller, Post, Body, UseGuards, Get, Req, HttpException} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserInfoDTO } from './user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { request } from 'https';
import { UserEntity } from './user.entity';

@Controller('')
export class UserController {
    constructor(private userService: UserService){}

    @Post('auth/login')
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post('auth/register')
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }

    @Get('auth/loggeduser')
    @UseGuards(new AuthGaurd())
    getLoguedUser(@Body() data: UserInfoDTO){
        let logguedUser:UserInfoDTO = this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.userService.getUser(logguedUser.id);
    }       
}
