import request from 'supertest';
import { app } from '../../app';
import crypto from 'crypto';

jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValue(true),
        }),
    };
});

describe('User Registration Tests', () => {
    it('returns 400, missing username', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send();

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("'username' is required.");
    });

    it('returns 400, missing email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("'email' is required.");
    });

    it('returns 400, invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Invalid email address.");
    });

    it('returns 400, missing password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`password` is required.");
    });

    it('returns 400, invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com", password: 123 });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`password` must be between 6 and 16 characters.");
    });

    it('returns 200, successful registration', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com", password: 123456 });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("User registered successfully.");
    });
});

describe('User Login Tests', () => {
    it('returns 400, missing email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send();

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("'email' is required.");
    });

    it('returns 400, invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "johndoe" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Invalid email address.");
    });

    it('returns 400, missing password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "johndoe@example.com" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`password` is required.");
    });

    it('returns 400, password should be of length 6 to 16 characters', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "johndoe@example.com", password: 123 });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`password` must be between 6 and 16 characters.");
    });

    it('returns 200, successful login', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com", password: 123456 });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "johndoe@example.com", password: 123456 });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('data.token');
        expect(body).toHaveProperty('data.refreshToken');
    });
});

describe('Forgot Password Tests', () => {
    it('returns 400, missing email', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send();

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`email` is required.");
    });

    it('returns 400, invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: "johndoe" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Invalid email address.");
    });

    it('returns 404, email not found', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: "johndoe@example.com" });

        expect(response.statusCode).toBe(404);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`email` not found.");
    });

    it('returns 200, reset password email sent to user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com", password: 123456 });

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: "johndoe@example.com" });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Reset password link has been sent to your email.");
    });
});

describe('Reset Password Tests', () => {
    it('returns 400, missing resetPasswordToken', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send();

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`resetPasswordToken` is required.");
    });

    it('returns 400, invalid resetPasswordToken', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "testingtoken" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`resetPasswordToken` should be of length 20.");
    });

    it('returns 400, missing newPassword', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787" });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`newPassword` is required.");
    });

    it('returns 400, invalid newPassword', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787", newPassword: 123 });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`newPassword` must be between 6 and 16 characters.");
    });

    it('returns 400, missing confirmPassword', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787", newPassword: 123456 });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`confirmPassword` is required.");
    });

    it('returns 400, invalid confirmPassword', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787", newPassword: 123456, confirmPassword: 123123 });

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`confirmPassword` does not match.");
    });

    it('returns 404, resetPasswordToken not found', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787", newPassword: 123456, confirmPassword: 123456 });

        expect(response.statusCode).toBe(404);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`resetPasswordToken` not found.");
    });

    it('returns 200, successful password reset', async () => {
        const mockRandomBytes = jest.spyOn(crypto, 'randomBytes');
        mockRandomBytes.mockImplementation(() => Buffer.from('2d89483023b9e3b0a787', 'hex'));

        await request(app)
            .post('/api/auth/register')
            .send({ username: "johndoe", email: "johndoe@example.com", password: 123456 });

        await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: "johndoe@example.com" });


        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({ resetPasswordToken: "2d89483023b9e3b0a787", newPassword: 123456, confirmPassword: 123456 });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Password updated successfully.");
    });
});