import { Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserRepositoryImpl } from '../../infrastructure/repositories/userRepositoryImpl';
import { AuthController } from './authController';
import { UserController } from './userController';
import { EncryptImpl } from '../../infrastructure/utils/encrypt.jwt';
import { RedisCacheService } from '../../infrastructure/cache/redis.cache';
const encrypt = new EncryptImpl();
const redisCacheService = new RedisCacheService();

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export function apiRoutes(): Router {
    const router = Router();

    router.use('/users', userController.router);

    return router;
}