import { Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserRepositoryImpl } from '../../infrastructure/repositories/userRepositoryImpl';
import { AuthController } from './authController';
import { UserController } from './userController';
import { EncryptImpl } from '../../infrastructure/utils/encrypt.jwt';
import { RedisCacheService } from '../../infrastructure/cache/redis.cache';
import { AuthService } from '../../app/services/authService';
import { LinkRepositoryImpl } from '../../infrastructure/repositories/linkRepositoryImpl';
import { LinkService } from '../../app/services/linkService';
import { LinkController } from './linkController';
const encrypt = new EncryptImpl();
const redisCacheService = new RedisCacheService();

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository, redisCacheService);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService)

const linkRepository = new LinkRepositoryImpl();
const linkService = new LinkService(linkRepository, userRepository, redisCacheService);
const linkController = new LinkController(linkService);

export function apiRoutes(): Router {
    const router = Router();

    router.use('/users', userController.router);
    router.use('/auth', authController.router);
    router.use('/links', linkController.router);

    return router;
}