import { ValidationError } from 'express-validator';
import { RestaurantError } from './RestaurantError';

export class RequestValidationError extends RestaurantError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('super: Request validation error');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return { status: false, message: this.errors[0].msg };
    }
}
