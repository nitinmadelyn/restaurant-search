import crypto from 'crypto';

export const generateRandomBytes = (size: number) => {
    return crypto.randomBytes(size).toString('hex');
};