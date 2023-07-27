import { param } from "express-validator";

const deleteRestaurant = [
    param('id')
        .notEmpty()
        .withMessage('`id` is required.')
        .isMongoId()
        .withMessage(`Invalid id.`)
];

export default deleteRestaurant;