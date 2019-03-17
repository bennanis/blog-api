import { Controller, Post, Body, UseGuards, Get, Req, HttpException, Param, Put, Guard} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserInfoDTO } from './user.dto';
import { AuthGaurd } from 'src/user/guards/auth.gaurd';
import { request } from 'https';
import { UserEntity, UserRole } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from './guards/role.guard';
import { ApiUseTags, ApiImplicitBody } from '@nestjs/swagger';

@Controller('user')
@ApiUseTags('user')
@UseGuards(RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('logged')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    getLoguedUser(){
        let logguedUser:UserInfoDTO = this.userService.getLoggedUser();
        return this.userService.getById(logguedUser.id);
    }
    
    @Put('update')
    @Roles(UserRole.STANDARD, UserRole.AUTHOR)
    @ApiImplicitBody({ name: "userData", required: true, type: UserInfoDTO})
    async update(@Body() userData: Partial<UserInfoDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        return this.userService.update(logguedUser.id, userData) ;
    }       
}
