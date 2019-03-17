import { UserRole } from "./user.entity";


export class UserDTO {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
    type: UserRole;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class UserInfoDTO {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    type: UserRole;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class UserLoginDTO {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    type: UserRole;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    token: string;
}