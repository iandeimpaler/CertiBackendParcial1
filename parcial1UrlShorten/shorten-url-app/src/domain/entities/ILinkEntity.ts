import { IUserEntity } from "./IUserEntity";

export interface ILinkEntity {
    id?: string;
    shortUrl: string;
    longUrl: string;
    createdAt: Date;
    user: IUserEntity;
}