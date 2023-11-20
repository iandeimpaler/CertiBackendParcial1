
import bcrypt from "bcrypt";

import { AppDataSource } from "../config/dataSource";
import { Link } from "../../domain/models/link";
import logger from '../../infrastructure/logger/logger';
import { DeleteResult } from "typeorm";
import { bcrypt_vars } from "../config/config";
import { LinkRepository } from "../../domain/interfaces/linkRepository";
import { LinkEntity } from "../entities/linkEntity";

export class LinkRepositoryImpl implements LinkRepository {
    async deleteLink(id: string): Promise<DeleteResult> {
        logger.info("En delete link repository")
        const linkEntity = await AppDataSource.getRepository(LinkEntity).delete({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(linkEntity)}`);
        return linkEntity;
    }

    async findById(id: string): Promise<Link | null> {
        logger.info("En find by id user repository")
        const linkEntity = await AppDataSource.getRepository(LinkEntity).findOne({
            where: { id },
            relations: ['user']
        });
        logger.debug(`Respuesta de DB:${JSON.stringify(linkEntity)}`);
        return linkEntity ? new Link(linkEntity) : null;
    }

    async findByLongUrl(longUrl: string): Promise<Link | null> {
        const linkRepository = AppDataSource.getRepository(LinkEntity);
        const link = await linkRepository.findOne({
            where: { long_url: longUrl },
            relations: ['user']
        });
        return link ? new Link(link) : null;
    }

    async createLink(link: Link): Promise<Link> {
        logger.info("En create link repository");
        // TODO: set user values 
        const linkEntity = AppDataSource.getRepository(LinkEntity).create({
            id:link.id,
            long_url: link.longUrl,
            short_url: link.shortUrl,
            createdAt: link.createdAt || new Date(),
            user: link.user
        });
        logger.debug(`Respuesta de DB userEntity ${JSON.stringify(linkEntity)}`);        

        const linkResponse = await AppDataSource.getRepository(LinkEntity).save(linkEntity);
        logger.debug(`Respuesta de DB linkResponse ${JSON.stringify(linkResponse)}`);
        return new Link({
            id: linkResponse.id,
            long_url: linkResponse.long_url,
            short_url: linkResponse.short_url,
            createdAt: linkResponse.createdAt,
            user: linkResponse.user
        });
    }
}