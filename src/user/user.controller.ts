import { Controller, Post, Body, UseGuards, Get, Req, HttpException, Param, Put, Guard} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserInfoDTO } from './user.dto';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { request } from 'https';
import { UserEntity, UserRole } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from './guards/role.guard';

@Controller('')
@UseGuards(RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('auth/login')
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post('auth/register')
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }

    @Get('auth/loggeduser')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    getLoguedUser(@Body() data: UserInfoDTO){
        let logguedUser:UserInfoDTO = this.userService.getLoggedUser();
        return this.userService.getById(logguedUser.id);
    }
    
    @Put('user/update')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async update(@Body() data: Partial<UserInfoDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.userService.update(logguedUser.id, data) ;
    }       
}
