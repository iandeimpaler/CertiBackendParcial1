import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import logger from "../../infrastructure/logger/logger";
import { CreateUserDTO } from "../dtos/user/create.user.dto";
import { UserDto } from '../dtos/user/user.dto';
import { UpdateUserDTO } from "../dtos/user/update.user.dto";
import { DeletedDTO } from "../dtos/deleted";
import { RedisCacheService } from "../../infrastructure/cache/redis.cache";

export class UserService {
    constructor(private userRepository: UserRepository, private redisCacheService: RedisCacheService) { }

    async getCache(userId: string){
        const USER_KEY = 'USER';
        const sol = await this.redisCacheService.get(`${USER_KEY}:${userId}`);
        console.log(sol);
        return sol;
    }

    setCache(userId: string, user: User){
        const USER_KEY = 'USER';
        this.redisCacheService.set(`${USER_KEY}:${userId}`, JSON.stringify(user));
    }

    async getUserById(id: string): Promise<UserDto | null> {

        const userCache = await this.getCache(id);
        const userObject : User= JSON.parse(userCache);
        if(!userObject){
            logger.info("En get user by id service");
            const user = await this.userRepository.findById(id);
            if(!user){
                logger.debug("No existe el usuario con id:"+id)
                throw new Error("Hubo un error");
            }
            logger.debug(`Get usr service: Usuario regresado por repository ${JSON.stringify(user)}`);


            const userResponse: UserDto = {
                id: user.id,
                email: user.email,
                lastLogin: user.lastLogin,
                numberOfLinks: user.numberOfLinks
            }
            this.setCache(user.id, user);
            return userResponse;
        } else{
            logger.info("Utilizando user cache");
            const userReponse: UserDto = {
                id: userObject.id,
                email: userObject.email,
                lastLogin: userObject.lastLogin,
                numberOfLinks: userObject.numberOfLinks
            }
            return userReponse;
        }
    }

    async createUser(userDto: CreateUserDTO): Promise<UserDto> {
        
        const userEntity: IUserEntity = {
            email: userDto.email,
            password: userDto.password,
            createdAt: new Date(),
            lastLogin: null,
            numberOfLinks: 0
        };
        const newUser = new User(userEntity);
        const responseUser = await this.userRepository.createUser(newUser);
        logger.debug(`Create user Service: Usuario regresado por repository ${JSON.stringify(responseUser)}`);
        return {id: responseUser.id, email: responseUser.email, lastLogin: responseUser.lastLogin, numberOfLinks: responseUser.numberOfLinks};
    }

    async updateUser(userDto: UpdateUserDTO, id: string): Promise<UserDto> {
        logger.info("En update user service");
        const backupUser = await this.userRepository.findById(id);
        if (!backupUser){
            logger.debug("No existe el usuario con id:"+id)
            throw new Error("No existe el usuario con id: "+id+" User DTO: "+userDto);
        }
        logger.debug(`Update usr service: Usuario regresado por repository ${JSON.stringify(backupUser)}`);

        const user: IUserEntity = {
            id: backupUser.id,
            email: (userDto.email ? userDto.email : backupUser.email),
            password: (userDto.password ? userDto.password : backupUser.password),
            createdAt: backupUser.createdAt,
            lastLogin: backupUser.lastLogin,
            numberOfLinks: backupUser.numberOfLinks
        }
        const passChanged = (userDto.password ? true : false);
        const responseUser = await this.userRepository.updateUser(new User(user), id, passChanged);
        logger.debug(`Update user Service: Usuario regresado por repository ${JSON.stringify(responseUser)}`);
        return {id: responseUser.id,email: responseUser.email, lastLogin: responseUser.lastLogin, numberOfLinks: responseUser.numberOfLinks};
    }

    async deleteUser(id: string): Promise<DeletedDTO | null> {

        logger.info("En delete user by id service");
        const user = await this.userRepository.deleteUser(id);
        if (!user){
            return null
        }
        logger.debug(`Delete usr service: Mensaje regresado por repository ${JSON.stringify(user)}`);

        const userResponse: DeletedDTO = {
            message: "El usuario ha sido eliminado exitosamente"
        }

        const deletedUser = new User( {
            id: id,
            email: "null",
            lastLogin: null,
            numberOfLinks: 0,
            password: null,
            createdAt: null
        })
        this.setCache(id, deletedUser);

        return userResponse;
    }

}