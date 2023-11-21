import bcrypt from "bcrypt";

import { UserRepository } from "../../domain/interfaces/userRepository";
import { UserEntity } from "../entities/userEntity";
import { AppDataSource } from "../config/dataSource";
import { User } from "../../domain/models/user";
import logger from '../../infrastructure/logger/logger';
import { DeleteResult } from "typeorm";
import { bcrypt_vars } from "../config/config";


export class UserRepositoryImpl implements UserRepository {

    async deleteUser(id: string): Promise<DeleteResult> {
        logger.info("En delete user repository")
        const userEntity = await AppDataSource.getRepository(UserEntity).delete({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(userEntity)}`);
        return userEntity;
    }

    async findById(id: string): Promise<User | null> {
        logger.info("En find by id user repository")
        const userEntity = await AppDataSource.getRepository(UserEntity).findOneBy({id});
        logger.debug(`Respuesta de DB:${JSON.stringify(userEntity)}`);
        return userEntity ? new User(userEntity) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOneBy({email});
        return user ? new User(user) : null;
    }

    async createUser(user: User): Promise<User> {
        logger.info("En create user repository")
        // TODO: set user values 
        const salt = bcrypt.genSaltSync(bcrypt_vars.saltSync);
        const hash = bcrypt.hashSync(user.password, salt);
        const userEntity = AppDataSource.getRepository(UserEntity).create({
            id:user.id,
            email: user.email,
            password: hash,
            createdAt: user.createdAt || new Date(),
            lastLogin: user.lastLogin || null,
            numberOfLinks: user.numberOfLinks || 0
        });
        logger.debug(`Respuesta de DB userEntity ${JSON.stringify(userEntity)}`);        

        const userResponse = await AppDataSource.getRepository(UserEntity).save(userEntity);
        logger.debug(`Respuesta de DB userResponse ${JSON.stringify(userResponse)}`);
        return new User({
            id: userResponse.id,
            email: userResponse.email,
            password: userResponse.password,
            createdAt: userResponse.createdAt,
            lastLogin: userResponse.lastLogin,
            numberOfLinks: userResponse.numberOfLinks
        });
    }

    async updateUser(user: User, id: string, passChanged: boolean): Promise<User> {
        if(passChanged){
            const salt = bcrypt.genSaltSync(bcrypt_vars.saltSync);
            const hash = bcrypt.hashSync(user.password, salt);
            user.setPass(hash);
        }
        logger.info("En update user repository")
        // TODO: set user values 
        const userAux = await AppDataSource.getRepository(UserEntity).findOneBy({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(userAux)}`);
        const userResponse = AppDataSource.getRepository(UserEntity).merge(userAux, user);
        logger.debug(`Respuesta de DB:${JSON.stringify(userResponse)}`);
        const newUser = await AppDataSource.getRepository(UserEntity).save(userAux);
        return newUser? new User({
            id: newUser.id,
            email: newUser.email,
            password: newUser.password,
            createdAt: newUser.createdAt,
            lastLogin: newUser.lastLogin,
            numberOfLinks: newUser.numberOfLinks
        }) : null;
    }
}