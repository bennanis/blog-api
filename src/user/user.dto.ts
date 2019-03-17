import { UserRole } from "./user.entity";
import { ApiModelProperty } from "@nestjs/swagger";


export class UserDTO {
    id: number;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    password: string;

    @ApiModelProperty()
    first_name: string;

    @ApiModelProperty()
    last_name: string;

    avatar: string;

    type: UserRole;

    active: boolean;

    created_at: Date;

    updated_at: Date;
}

export class UserInfoTokenDTO {
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
export class UserInfoDTO {
    id: number;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    first_name: string;

    @ApiModelProperty()
    last_name: string;

    @ApiModelProperty()
    avatar: string;
    
    type: UserRole;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class UserLoginDTO {
    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    password: string;
}

