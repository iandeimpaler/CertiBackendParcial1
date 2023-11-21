import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../../../infrastructure/config/config';

export const verifyDeleteMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user_id;
    const { id } = req.params;

    if (userId === id) {
        next();
    } else {
        res.status(401).json({ message: "La accion no puede realizarse" });
    }
};