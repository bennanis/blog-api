import { Injectable, Req, HttpException } from '@nestjs/common';
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
            return {'success': false, 'info': 'Missing information'}
        
        const {email, password} = data;
        let user = await this.userRepository.findOne({where: {email}})
        if(!user)
            return {'success': false, 'info': 'Wrong email address'}
        else if(!await user.comparePassword(password))
            return {'success': false, 'info': 'Wrong password'}
            
        this.loggedUser = user.toResponseObject(true); 
        return user.toResponseObject(true);
    }

    async register(data: UserDTO)
    {
        if(!data.email)
            throw new HttpException('Missing email address!', 404);

        const {email} = data;
        let user = await this.userRepository.findOne({where: {email}});

        if(user)
            throw new HttpException('User already exists !', 404);
        
        if(!data.password || !data.first_name || !data.last_name)
            throw new HttpException('Missing information !', 404);

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);

        throw new HttpException('Successful registration !', 200);
    }


    getUser(userId: number): Promise<UserInfoDTO>
    {
        let id = Number(userId);
        return  new Promise(async resolve => {
            let user = await this.userRepository.findOne(userId);
            if (!user) {
                throw new HttpException('User does not exist!', 404);
            }
            resolve(user.toResponseObject());
        });
    }


}
