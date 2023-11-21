import { Request, Response, Router } from 'express';
import { LinkService } from '../../app/services/linkService'
import { Link } from '../../domain/models/link';
import { DeleteResult } from 'typeorm';
import logger from '../../infrastructure/logger/logger';
import { CreateLinkDTO } from '../../app/dtos/link/create.link.dto';
import { DeletedDTO } from '../../app/dtos/deleted';
import { verifyTokenMiddleware } from '../middleware/verifyToken';
import { linkValidate, linkValidationRules } from '../middleware/link/verifyCreate';

export class LinkController {
    public router: Router;
    private linkService: LinkService;

    constructor(linkService: LinkService) {
        this.linkService=linkService;
        this.router = Router();
        this.routes();
    }

    async getLinkById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const link = await this.linkService.getLinkById(id);
            res.status(200).json(link);
        } catch (error) {
            if(error instanceof Error){
                logger.error("Error al conseguir usuario "+error.message, req.params);
            } else{
                logger.error("Error al conseguir usuario "+error, req.params);
                
            }   
            res.status(404).json({ message: "Hubo un problema al conseguir el usuario"});
            return;
        }
    }

    async createLink(req: Request, res: Response): Promise<Response> {
        const link : CreateLinkDTO = req.body;
        const userId = req.user_id;
        try {
            const newLink = await this.linkService.createLink(link, userId);
            res.status(201).json(newLink);
        } catch (error) {
            logger.error("Error al crear usuario: "+error, req.body);
            if(error instanceof Error)
                return res.status(500).json({ message: "Hubo un problema al crear el usuario" });
            else
                return res.status(500).json({ message: "Hubo un problema al crear el usuario"});
        }
    }

    async deleteLink(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userId = req.user_id;
        try {
            const result: DeletedDTO = await this.linkService.deleteLink(id, userId);
        } catch (error) {
            logger.error('Hubo un error al eliminar el link '+req.params.id+': '+error)
        }
        res.status(202).json({ message: 'Link eliminado exitosamente' });
    }

    public routes() {
        this.router.get('/:id', verifyTokenMiddleware, this.getLinkById.bind(this));
        this.router.post('/',verifyTokenMiddleware, linkValidationRules(), linkValidate, this.createLink.bind(this));
        this.router.delete('/:id', verifyTokenMiddleware, this.deleteLink.bind(this));
    }
}
