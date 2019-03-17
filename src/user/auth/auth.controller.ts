import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { UserService } from '../user.service';
import { ApiUseTags, ApiResponse, ApiImplicitBody } from '@nestjs/swagger';
import { UserDTO, UserLoginDTO } from '../user.dto';

@Controller('auth')
@ApiUseTags('auth')
export class AuthController {

    constructor(private readonly userService: UserService){}

    @Post('login')
    @ApiResponse({ status: HttpStatus.OK, description: 'Successful loggin.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Data is invalid.'})
    login(@Body() userLoginData: UserLoginDTO){
        return this.userService.login(userLoginData);
    }

    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Successful registration.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Data is invalid.'})
    register(@Body() userData: UserDTO){
        return this.userService.register(userData);
    }

}
