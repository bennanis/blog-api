import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity, UserRole } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async updateUserEmail(logguedUser: number, userId:number, email:string)
    {
        let user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
        }

        if(user.type == UserRole.ADMIN)
            throw new HttpException('Not allowed !', HttpStatus.UNAUTHORIZED);

        let ifExist = await this.userRepository.findOne({where: {email:email}})
        if(ifExist)
            throw new HttpException('Error !', HttpStatus.BAD_REQUEST);

        user.email = email;
        await this.userRepository.update(userId, user);

        throw new HttpException('Success update !', HttpStatus.CREATED);
    }

    async disabledUser(userId:number)
    {
        let user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
        }
        if(user.type == UserRole.ADMIN)
            throw new HttpException('Not allowed !', HttpStatus.UNAUTHORIZED);

        user.active = false;
        await this.userRepository.update(userId, user);

        throw new HttpException('disabled successfully !', HttpStatus.CREATED);
    }

    async deleteUser(userId:number)
    {
        let user = await this.userRepository.findOne(userId);
        if (!user)
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);

        if(user.type == UserRole.ADMIN)
            throw new HttpException('Not allowed !', HttpStatus.UNAUTHORIZED);

        await this.userRepository.delete(userId);
        
        throw new HttpException('Deleted successfully !', HttpStatus.CREATED);
    }

    async getUserById(userId: number)
    {
        let user = await this.userRepository.findOne(userId, {relations: ["articles", "comments", "sections"]});
        if (!user) {
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async getAllUser(orderByRole: string){
        
        if(orderByRole !== "true"){
            return await this.userRepository.createQueryBuilder("user")
            .select(["user.id", "user.first_name", "user.last_name", "user.type"])
            .orderBy("user.created_at", "DESC")
            .getMany();
        } else {
            return await this.userRepository.createQueryBuilder("user")
            .orderBy("user.type", "ASC")
            .getMany();
        }

    }


    async changeUserType(logguedUserId:number,userId: number,type:string){
        let user = await this.userRepository.findOne(userId);
        if (!user)
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);

        if((user.type == UserRole.ADMIN) && (user.id !== logguedUserId))
            throw new HttpException('Not allowed !', HttpStatus.UNAUTHORIZED);

        switch(type){
            case "standard":
                user.type = UserRole.STANDARD;
                break;
            case "author":
                user.type = UserRole.AUTHOR;
                break;
            case "admin":
                user.type = UserRole.ADMIN;
                break;
            default:
                throw new HttpException('Error update role !', HttpStatus.BAD_REQUEST);

        }
  
        await this.userRepository.update(userId, user);

        throw new HttpException('Success update !', HttpStatus.CREATED);

    }

}
