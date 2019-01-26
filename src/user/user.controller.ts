import { Controller, Post, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('register')
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }


}
