import { body } from "express-validator";

const loginValidation = [
    body('email')
        .notEmpty()
        .withMessage(`'email' is required.`)
        .isEmail()
        .withMessage(`Invalid email address.`),
    body('password')
        .notEmpty()
        .withMessage('`password` is required.')
        .isLength({ min: 6, max: 16 })
        .withMessage('`password` must be between 6 and 16 characters.')
];

export default loginValidation;