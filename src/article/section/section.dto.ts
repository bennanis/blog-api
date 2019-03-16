import { UserEntity } from "src/user/user.entity";


export class SectionDTO {
    id: number;
    titre: string;
    user: UserEntity;
    created_at: Date;
    updated_at: Date;
}

