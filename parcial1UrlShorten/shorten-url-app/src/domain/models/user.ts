import { IUserEntity } from '../entities/IUserEntity';
import { v4 as uuidv4 } from 'uuid';

export class User {
    id: string;
    password: string;
    email: string;
    createdAt: Date;
    lastLogin: Date | null;
    numberOfLinks: number;
    token: string | null;

    constructor(userEntity: Partial<IUserEntity>) {
        this.id = userEntity.id || uuidv4();
        this.email = userEntity.email;
        this.password = userEntity.password;
        this.createdAt = userEntity.createdAt || new Date();
        this.numberOfLinks = userEntity.numberOfLinks || 0;
        this.lastLogin = userEntity.lastLogin;
    }

}