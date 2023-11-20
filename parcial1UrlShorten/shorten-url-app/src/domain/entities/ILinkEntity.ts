import { IUserEntity } from "./IUserEntity";

export interface ILinkEntity {
    id?: string;
    short_url: string;
    long_url: string;
    createdAt: Date;
    user: IUserEntity;
}