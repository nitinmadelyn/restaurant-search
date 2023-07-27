import { body } from "express-validator";

const forgotPasswordValidation = [
    body('email')
        .notEmpty()
        .withMessage('`email` is required.')
        .isEmail()
        .withMessage(`Invalid email address.`)
];

export default forgotPasswordValidation;