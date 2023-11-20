import { v4 as uuidv4 } from 'uuid';
import { ILinkEntity } from '../entities/ILinkEntity';
import { IUserEntity } from '../entities/IUserEntity';

export class Link {
    id: string;
    shortUrl: string;
    longUrl: string;
    createdAt: Date;
    user: IUserEntity;

    constructor(linkEntity: Partial<ILinkEntity>) {
        this.id = linkEntity.id || uuidv4();
        this.shortUrl=linkEntity.short_url;
        this.longUrl=linkEntity.long_url;
        this.createdAt=linkEntity.createdAt;
        this.user=linkEntity.user;
    }

}