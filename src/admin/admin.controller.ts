import { Controller, UseGuards, Put, Body, Param, HttpException, HttpStatus, Delete, Get } from '@nestjs/common';
import { RoleGuard } from 'src/user/guards/role.guard';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user.entity';
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

    @Get('user/:userId')
    @Roles(UserRole.ADMIN)
    async getUserById(@Param('userId') userId:number){
        return this.adminService.getUserById(userId);
    }
    
    @Delete('user/:userId')
    @Roles(UserRole.ADMIN)
    async deleteUser(@Param('userId') userId:number){
        return this.adminService.deleteUser(userId) ;
    }   
}
