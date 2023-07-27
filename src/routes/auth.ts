import express, { Request, Response } from 'express';
import { User } from '../models/user';
import registerValidation from '../validations/register';
import loginValidation from '../validations/login';
import validateRequest from '../middleware/validateRequest';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import { Password } from '../helpers/password';
import forgotPasswordValidation from '../validations/forgotPassword';
import config from '../config/config';
import sendEmail from '../helpers/sendEmail';
import { NotFoundError } from '../errors/NotFoundError';
import resetPasswordValidation from '../validations/resetPassword';
import { generateRandomBytes } from '../helpers/common';

const router = express.Router();

router.post(
    '/api/auth/register',
    registerValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { username, email, password } = req.body;

        const userBuild = User.build({
            username,
            email: email.toLowerCase(),
            password
        });
        const user = await userBuild.save();

        res.status(200).send({ status: true, message: "User registered successfully." });
    });

router.post(
    '/api/auth/login',
    loginValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email: req.body?.email });
        // check if user exists
        if (!user) {
            throw new BadRequestError('Invalid `email` or `password`.');
        }

        const isCorrectPassword = await Password.compare(user.password, password.toString());
        // check if password matched
        if (!isCorrectPassword) {
            throw new BadRequestError('Invalid `email` or `password`.');
        }

        // generate jwt token
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY!, { expiresIn: config.JWT.tokenExpiresIn });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY!, { expiresIn: config.JWT.refreshTokenExpiresIn });
        await User.updateOne({ email }, { $set: { refreshToken } });

        res.cookie('token', token);
        res.status(200).send({ status: true, data: { token, refreshToken } })
    });

router.post(
    '/api/auth/forgot-password',
    forgotPasswordValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('`email` not found.');
        }

        const resetPasswordToken = generateRandomBytes(10);
        await User.updateOne({ email }, { $set: { resetPasswordToken } });

        // this can be replace with some npm module like markup
        const body = config.email.resetPassword.body.replaceAll('{{resetPasswordToken}}', resetPasswordToken);
        const emailData = { to: email, subject: config.email.resetPassword.subject, body };
        await sendEmail(emailData);

        res.status(200).send({ status: true, message: 'Reset password link has been sent to your email.' })
    });

router.post(
    '/api/auth/reset-password',
    resetPasswordValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { resetPasswordToken, newPassword } = req.body;

        const user = await User.findOne({ resetPasswordToken });
        if (!user) {
            throw new NotFoundError('`resetPasswordToken` not found.');
        }
        const hashedPassword = await Password.toHash(newPassword.toString());
        await User.updateOne({ _id: user.id }, { $set: { password: hashedPassword, resetPasswordToken: '' } });

        res.status(200).send({ status: true, message: 'Password updated successfully.' });
    })

export { router as authRouter };
