import { NextFunction, Response, Request } from "express";
import { body, validationResult } from 'express-validator';

export const linkValidationRules = () => {
    return [
        body('longUrl').isURL()
    ]
}

export const linkValidate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};