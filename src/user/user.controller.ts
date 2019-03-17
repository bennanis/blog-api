import { Controller, Post, Body, UseGuards, Get, Req, HttpException, Param, Put, Guard} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserInfoDTO } from './user.dto';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { request } from 'https';
import { UserEntity, UserRole } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from './guards/role.guard';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('')
@UseGuards(RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('auth/login')
    @ApiUseTags('user')
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post('auth/register')
    @ApiUseTags('user')
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }

    @Get('user/loggeduser')
    @ApiUseTags('user')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    getLoguedUser(@Body() data: UserInfoDTO){
        let logguedUser:UserInfoDTO = this.userService.getLoggedUser();
        return this.userService.getById(logguedUser.id);
    }
    
    @Put('user/update')
    @ApiUseTags('user')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    async update(@Body() data: Partial<UserInfoDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.userService.update(logguedUser.id, data) ;
    }       
}
