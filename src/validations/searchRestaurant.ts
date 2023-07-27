import { query } from "express-validator";

const searchRestaurant = [
    query('location')
        .notEmpty()
        .withMessage('`location` is required.')
        .custom(value => value.includes(','))
        .withMessage('Invalid location. e.g. -74.0033,40.7336')
        .custom(value => {
            const latLong = value.split(',');

            if (latLong.length !== 2) {
                return false;
            }

            const latitude = parseFloat(latLong[0]);
            const longitude = parseFloat(latLong[1]);

            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                return false;
            }

            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                return false;
            }

            return true;
        })
        .withMessage('Invalid location. e.g. -74.0033,40.7336'),
    query('radius')
        .optional()
        .isNumeric()
        .withMessage('`radius` should be of type number.')
];

export default searchRestaurant;