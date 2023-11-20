import { Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserRepositoryImpl } from '../../infrastructure/repositories/userRepositoryImpl';
import { AuthController } from './authController';
import { UserController } from './userController';
import { EncryptImpl } from '../../infrastructure/utils/encrypt.jwt';
import { RedisCacheService } from '../../infrastructure/cache/redis.cache';
import { AuthService } from '../../app/services/authService';
const encrypt = new EncryptImpl();
const redisCacheService = new RedisCacheService();

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService)

export function apiRoutes(): Router {
    const router = Router();

    router.use('/users', userController.router);
    router.use('/auth', authController.router);

    return router;
}