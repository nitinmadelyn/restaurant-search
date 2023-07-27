import { Request, Response, NextFunction } from 'express';
import { RestaurantError } from '../errors/RestaurantError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof RestaurantError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }

    return res.status(400).send({ status: false, message: err.message });
};
