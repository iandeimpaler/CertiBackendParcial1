import { LinkRepository } from '../../domain/interfaces/linkRepository';
import { Link } from '../../domain/models/link';
import { DeleteResult } from 'typeorm';
import { ICacheService } from '../../domain/interfaces/cacheService';

export class LinkService {
    constructor(private linkRepository: LinkRepository, private redisCacheService: ICacheService) {}

    async getLinkById(id: string): Promise<Link | null> {
        const linkCache = await this.redisCacheService.get(`LINK:${id}`);
        const linkObject: Link = JSON.parse(linkCache);

        if (!linkObject) {
            const link = await this.linkRepository.findById(id);

            if (!link) {
                throw new Error(`No existe el link con id: ${id}`);
            }

            this.redisCacheService.set(`LINK:${id}`, JSON.stringify(link));

            return link;
        } else {
            return linkObject;
        }
    }

    async createLink(link: Link): Promise<Link> {
        const newLink = await this.linkRepository.createLink(link);
        this.redisCacheService.set(`LINK:${newLink.id}`, JSON.stringify(newLink));
        return newLink;
    }

    async deleteLink(id: string): Promise<DeleteResult> {
        const result = await this.linkRepository.deleteLink(id);
        this.redisCacheService.set(`LINK:${id}`, 'null'); // Invalidate cache
        return result;
    }

    async getLinkByLongUrl(longUrl: string): Promise<Link | null> {
        const link = await this.linkRepository.findByLongUrl(longUrl);
        return link;
    }
}
