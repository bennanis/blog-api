import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async login(data: UserDTO){
        if(!data.email || !data.password)
            return {'success': false, 'info': 'Missing information'}
        
        const {email, password} = data;
        let user = await this.userRepository.findOne({where: {email}})
        if(!user)
            return {'success': false, 'info': 'Wrong email address'}
        else if(!await user.comparePassword(password))
            return {'success': false, 'info': 'Wrong password'}

        return user.toResponseObject();
    }

    async register(data: UserDTO){
        if(!data.email)
            return {'success': false, 'info': 'Missing email address'}

        const {email} = data;
        let user = await this.userRepository.findOne({where: {email}});

        if(user)
            return {'success': false, 'info': 'User already exists'}
        
        if(!data.password || !data.first_name || !data.last_name)
            return {'success': false, 'info': 'Missing information'}

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);

        return {'success': true, 'info': 'Successful registration'}
    }
}
