import { Controller, UseGuards, Put, Body, Param, HttpException, HttpStatus, Delete, Get, Query } from '@nestjs/common';
import { RoleGuard } from 'src/user/guards/role.guard';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole, UserEntity } from 'src/user/user.entity';
import { UserInfoDTO } from 'src/user/user.dto';
import { AdminService } from './admin.service';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('admin')
@UseGuards(RoleGuard)
export class AdminController {
    constructor(private adminService: AdminService, private readonly userService: UserService){}

    @Put('user/:userId/update-email')
    @Roles(UserRole.ADMIN)
    async updateUserEmail(@Param('userId') userId:number, @Body() data: Partial<UserInfoDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if(!data.email)
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
 
        return this.adminService.updateUserEmail(logguedUser.id, userId, data.email) ;
    }   

    @Put('user/:userId/disabled')
    @Roles(UserRole.ADMIN)
    async disabledUser(@Param('userId') userId:number){
        return this.adminService.disabledUser(userId) ;
    }

    @Get('user/all')
    @Roles(UserRole.ADMIN)
    async getAllUser(@Query('byRole') byRole){
        return this.adminService.getAllUser(byRole);
    }


    @Get('user/:userId')
    @Roles(UserRole.ADMIN)
    async getUserById(@Param('userId') userId:number){
        return this.adminService.getUserById(userId);
    }

    @Put('user/:userId/changeRole/:type')
    @Roles(UserRole.ADMIN)
    async changeUserType(@Param('userId') userId:number, @Param('type') type:string){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();

        return this.adminService.changeUserType(logguedUser.id, userId, type);
    }
    
    @Delete('user/:userId')
    @Roles(UserRole.ADMIN)
    async deleteUser(@Param('userId') userId:number){
        return this.adminService.deleteUser(userId) ;
    }   
}
