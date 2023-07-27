import { body } from "express-validator";

const resetPasswordValidation = [
    body('resetPasswordToken')
        .notEmpty()
        .withMessage('`resetPasswordToken` is required.')
        .isString()
        .withMessage('`resetPasswordToken` should be string.')
        .isLength({ min: 20, max: 20 })
        .withMessage('`resetPasswordToken` should be of length 20.'),
    body('newPassword')
        .notEmpty()
        .withMessage('`newPassword` is required.')
        .isLength({ min: 6, max: 16 })
        .withMessage('`newPassword` must be between 6 and 16 characters.'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('`confirmPassword` is required.')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('`confirmPassword` does not match.');
            } else {
                return true;
            }
        })
];

export default resetPasswordValidation;