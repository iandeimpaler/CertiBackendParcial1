import { Request, Response, Router } from 'express';
import { UserService } from '../../app/services/userService';
import { CreateUserDTO } from '../../app/dtos/user/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { UpdateUserDTO } from '../../app/dtos/user/update.user.dto';
import { verifyTokenMiddleware } from '../middleware/user/verifyToken';
import { equal } from 'assert';
import { verifyDeleteMiddleware } from '../middleware/user/verifyDelete';
import { InstanceChecker } from 'typeorm';
import { userValidationRules, validate } from '../middleware/user/verifyCreate';
import { updateValidate, userUpdateValidationRules } from '../middleware/user/verifyUpdate';

export class UserController {
    public router: Router;
    private userService: UserService;


    constructor(userService: UserService) {
        this.userService = userService;
        this.router = Router();
        this.routes();
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try{
            logger.info("Dentro de user by id controller");
            const { id } = req.params;
            console.log('testing=====', req.user_id);
            const userDto = await this.userService.getUserById(id);
            logger.debug(`Usuario enviado por userService ${JSON.stringify(userDto)}`)
            res.json(userDto);
        } catch(error){
            if(error instanceof Error){
                logger.error("Error al conseguir usuario "+error.message, req.params);
            } else{
                logger.error("Error al conseguir usuario "+error, req.params);
                
            }   
            res.status(404).json({ message: "Hubo un problema al conseguir el usuario"});
            return;
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        logger.info("Dentro de create user controller");
        try {
            const userDto: CreateUserDTO = req.body;
            const user = await this.userService.createUser(userDto);
            logger.debug(`Usuario enviado por userService ${JSON.stringify(user)}`)
            return res.status(201).json(user);
        } catch (error) {
            logger.error("Error al crear usuario: "+error, req.body);
            if(error instanceof Error)
                return res.status(500).json({ message: "Hubo un problema al crear el usuario" });
            else
                return res.status(500).json({ message: "Hubo un problema al crear el usuario"});
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        logger.info("Dentro de update user controller");
        try {
            const { id } = req.params;
            const userDto: UpdateUserDTO = req.body;
            const user = await this.userService.updateUser(userDto, id);
            logger.debug(`Usuario enviado por userService ${JSON.stringify(user)}`)
            return res.status(201).json(user);
        } catch (error) {
            if(error instanceof Error){
                logger.error("Error al actualizar usuario "+error.message, req.params);
            } else{
                logger.error("Error al actualizar usuario "+error, req.params);
                
            }   
            res.status(404).json({ message: "Hubo un problema al actualizar el usuario"});
            return;
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        logger.info("Dentro de delete user by id controller");
        const { id } = req.params;
        const userDto = await this.userService.deleteUser(id);
        logger.debug(`Usuario enviado por userService ${JSON.stringify(userDto)}`)
        res.status(202).json({ message: 'Usuario eliminado exitosamente' });
    }

    public routes() {
        this.router.get('/:id', verifyTokenMiddleware, this.getUserById.bind(this));
        this.router.post('/', userValidationRules(), validate, this.createUser.bind(this));
        this.router.put('/:id', verifyTokenMiddleware, userUpdateValidationRules(), updateValidate, this.updateUser.bind(this));
        this.router.delete('/:id', verifyTokenMiddleware, verifyDeleteMiddleware, this.deleteUser.bind(this));
    }
}