import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class AuthGaurd implements CanActivate {

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        if(!request.headers.authorization || request.headers.authorization.split(' ')[0] != 'Bearer')
            return false;
        
        const token = request.headers.authorization.split(' ')[1];
        const decoded = await this.validateToken(token);
        console.log(decoded);
        return decoded;
    }

    async validateToken(token: string){
        const decoded = await jwt.verify(token, 'mySalt');
        return decoded;
    }
}