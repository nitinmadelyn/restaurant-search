import { body } from "express-validator";
import { User } from "../models/user";

const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage(`'username' is required.`)
        .isString()
        .withMessage(`'username' should be of type string.`),
    body('email')
        .notEmpty()
        .withMessage(`'email' is required.`)
        .isEmail()
        .withMessage(`Invalid email address.`)
        .custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('Email already in use');
                }
            });
        }),
    body('password')
        .notEmpty()
        .withMessage('`password` is required.')
        .isLength({ min: 6, max: 16 })
        .withMessage('`password` must be between 6 and 16 characters.')
];

export default registerValidation;