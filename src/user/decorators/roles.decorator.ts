import { ReflectMetadata } from '@nestjs/common';
import { UserRole } from '../user.entity';

export const Roles = (...roles: UserRole[]) => ReflectMetadata('roles', roles);