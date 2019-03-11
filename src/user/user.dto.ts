import { UserRole } from "./user.entity";


export class UserDTO {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
    type: UserRole;
    is_author: boolean;
    created_at: Date;
    updated_at: Date;
}