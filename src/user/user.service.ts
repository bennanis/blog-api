import { Injectable, Req, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserInfoDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}
    private loggedUser: UserInfoDTO;

    getLoggedUser(){
        return this.loggedUser
    }

    async login(data: UserDTO)
    {
        if(!data.email || !data.password)
            throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
        
        const {email, password} = data;
        let user = await this.userRepository.findOne({where: {email}, select: ['id', 'email', 'password', 'first_name', 'last_name', 'avatar', 'active', 'type', 'created_at', 'updated_at']})
        if(!user)
            throw new HttpException('Wrong email address', HttpStatus.BAD_REQUEST);

        if(!user.active)
            throw new HttpException('account disabled', HttpStatus.BAD_REQUEST);

        if(!await user.comparePassword(password))
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
            
        this.loggedUser = user.toResponseObject(true);
        return user.toResponseObject(true);
    }

    async register(data: UserDTO)
    {
        if(!data.email)
            throw new HttpException('Missing email address!', HttpStatus.BAD_REQUEST);

        const {email} = data;
        let user = await this.userRepository.findOne({where: {email}});

        if(user)
            throw new HttpException('User already exists !', HttpStatus.BAD_REQUEST);
        
        if(!data.password || !data.first_name || !data.last_name)
            throw new HttpException('Missing information !', HttpStatus.BAD_REQUEST);

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);

        throw new HttpException('Successful registration !', HttpStatus.CREATED);
    }


    getById(userId: number): Promise<UserInfoDTO>
    {
        return  new Promise(async resolve => {
            let user = await this.userRepository.findOne(userId);
            if (!user) {
                throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
            }
            resolve(user.toResponseObject());
        });
    }

    async update(id: number, data: Partial<UserInfoDTO>)
    {
        let user = await this.userRepository.findOne(id);
        if (!user) {
            throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
        }
        if(data.first_name)
            user.first_name = data.first_name;
        if(data.last_name)
            user.last_name = data.last_name;
        if(data.avatar)
            user.avatar = data.avatar;

        await this.userRepository.update(id, user);
        this.loggedUser = user.toResponseObject(true); 

        throw new HttpException('Success update !', HttpStatus.CREATED);
    }

}
