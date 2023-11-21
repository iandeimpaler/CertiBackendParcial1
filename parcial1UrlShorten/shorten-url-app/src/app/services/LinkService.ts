import { LinkRepository } from '../../domain/interfaces/linkRepository';
import { Link } from '../../domain/models/link';
import { DeleteResult } from 'typeorm';
import { ICacheService } from '../../domain/interfaces/cacheService';
import logger from '../../infrastructure/logger/logger';
import { LinkDTO } from '../dtos/link/link.dto';
import { CreateLinkDTO } from '../dtos/link/create.link.dto';
import { UserRepository } from '../../domain/interfaces/userRepository';
import { User } from '../../domain/models/user';
import { DeletedDTO } from '../dtos/deleted';
import { userLimits } from '../../infrastructure/config/config';

export class LinkService {
    constructor(private linkRepository: LinkRepository, private userRepository: UserRepository, private redisCacheService: ICacheService){}

    async getCache(linkId: string){
        const LINK_KEY = 'LINK';
        const sol = await this.redisCacheService.get(`${LINK_KEY}:${linkId}`);
        return sol;
    }

    setCache(linkId: string, link: Link){
        const LINK_KEY = 'LINK';
        this.redisCacheService.set(`${LINK_KEY}:${linkId}`, JSON.stringify(link));
    }

    async getLinkById(id: string): Promise<LinkDTO | null> {
        const linkCache = await this.redisCacheService.get(`LINK:${id}`);
        const linkObject: Link = JSON.parse(linkCache);

        if (!linkObject) {
            const link = await this.linkRepository.findById(id);

            if (!link) {
                throw new Error(`No existe el link con id: ${id}`);
            }

            this.setCache(link.id, link);

            return {id: link.id, userId: link.user.id, shortUrl: link.shortUrl, longUrl: link.longUrl};
        } else {
            logger.info("Usando cache");
            return {id: linkObject.id, userId: linkObject.user.id, shortUrl: linkObject.shortUrl, longUrl: linkObject.longUrl};
        }
    }

    async createLink(link: CreateLinkDTO, id: string): Promise<LinkDTO> {
        const user : User = await this.userRepository.findById(id);
        if(user.numberOfLinks===userLimits.linkNumber){
            throw new Error("El usuario ya creó el máximo de links permitidos")
        }
        const linkModel = new Link({
            longUrl: link.longUrl,
            user: user
        });
        const newLink = await this.linkRepository.createLink(linkModel);
        this.setCache(newLink.id, newLink);
        return {id: newLink.id, userId: newLink.user.id, shortUrl: newLink.shortUrl, longUrl: newLink.longUrl};
    }

    async deleteLink(id: string, userId: string): Promise<DeletedDTO> {

        const link = await this.linkRepository.findById(id);
        if(link.user.id!==userId){
            throw new Error("El link no pertenece al usuario")
        }

        const result = await this.linkRepository.deleteLink(id);
        this.setCache(id, new Link({
            id: id,
            longUrl: null,
            shortUrl: null,
            user: null
        }) );
        const linkResponse: DeletedDTO = {
            message: "El link ha sido eliminado exitosamente"
        }
        return linkResponse;
    }
}
