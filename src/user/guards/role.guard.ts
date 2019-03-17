import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';
import { UserRole } from '../user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles)
      return true;
    
    if(this.userService.getLoggedUser() === undefined){
      throw new HttpException("You are not allowed to access this content (Login)", HttpStatus.UNAUTHORIZED);
    }

    const hasRole = () => roles.indexOf(this.userService.getLoggedUser().type) >= 0;

    if(hasRole() || this.userService.getLoggedUser().type == UserRole.ADMIN)
      return true; 

    throw new HttpException("You are not allowed to access this content (Role)", HttpStatus.UNAUTHORIZED);

  }
}