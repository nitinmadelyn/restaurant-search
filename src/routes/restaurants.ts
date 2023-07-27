import express, { Request, Response } from 'express';
import { Restaurant, findRestaurants } from '../models/restaurant';
import deleteRestaurant from '../validations/deleteRestaurant';
import validateRequest from '../middleware/validateRequest';
import { NotFoundError } from '../errors/NotFoundError';
import searchRestaurant from '../validations/searchRestaurant';

const router = express.Router();

router.get(
    '/api/restaurants/get-nearby-restaurants',
    searchRestaurant,
    validateRequest,
    async (req: Request, res: Response) => {
        const { location, radius } = req.query as any;

        const latLong = location.split(',');
        const restaurants = await findRestaurants(latLong[0], latLong[1], radius || 5);

        res.status(200).send({ status: true, count: restaurants.length, data: restaurants });
    });

router.get(
    '/api/restaurants/get-all-restaurants',
    async (req: Request, res: Response) => {
        const restaurants = await Restaurant.find({});

        res.status(200).send({ status: true, data: restaurants });
    });

router.delete(
    '/api/restaurants/delete-restaurant/:id',
    deleteRestaurant,
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await Restaurant.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new NotFoundError('Restaurant not found.')
        }

        res.status(200).send({ status: true, message: "Restaurant deleted successfully." });
    });

export { router as restaurantsRouter };